<template>
  <var-popup
    v-model:show="_show"
    @close="handleClose"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.7)' }"
    style="height: 100vh; background-color: rgba(0, 0, 0, 0.7); box-shadow: none; width: 100%">
    <div style="height: 100%; width: 100%; display: flex; flex-direction: column; position: relative">
      <!-- 回退按钮 -->
      <szd-top-back @click="handleCloseForm" />
      <!-- 加载 -->
      <div v-if="loading" class="top-loading">
        <var-loading description="loading" :loading="loading" />
      </div>
      <!-- 动画 -->
      <div v-if="isAnimation && !loading.value && !_paused && dg.animation" class="scanner-box">
        <div class="scanner-line" />
      </div>

      <!-- 输入框 -->
      <div v-if="dg.active === 'input'" class="main-input">
        <div class="row">
          <szd-input label="请录入码" v-model="dg.scanInput" />
        </div>
        <div class="row">
          <szd-button label="确定" @click="handelScanInputOkay()" class="but" />
          <szd-button label="取消" @click="handelScanInputCancel()" class="but" />
        </div>
      </div>
      <div v-if="dg.active === 'photo'" class="main-input">
        <div class="capture">
          <QrcodeCapture ref="refQrcodeCapture" :formats="_formats" @detect="onDetectCapture" capture="" class="input-file" />
        </div>
        <div class="row">
          <szd-button label="取消" @click="handelScanInputCancel()" class="but" />
        </div>
      </div>

      <!-- 摄像头 -->
      <div class="main-scan">
        <div :style="{ height: _scanZoom > 0 ? _scanZoom + '%' : '' }">
          <QrcodeStream
            :constraints="_constraints"
            :paused="_paused"
            :formats="_formats"
            :torch="_torch"
            @camera-on="onReady"
            @detect="onDetect"
            @error="onError"
            :track="track ? onTrack : undefined" />
        </div>
      </div>

      <!-- 表尾-功能区 -->
      <var-bottom-navigation
        v-if="isPhoto || isInput || isLight"
        v-model:active="dg.active"
        fixed
        style="border-top: 1px solid #f2f3f5"
        @change="handleNavChange">
        <!-- 扫一扫 -->
        <var-bottom-navigation-item name="scan" :label="$t('扫一扫')" />
        <!-- 相册 -->
        <var-bottom-navigation-item v-if="isPhoto" name="photo" :label="$t('相册')" />
        <!-- 输入码 -->
        <var-bottom-navigation-item v-if="isInput" name="input" :label="$t('输入码')" />
        <!-- 手电筒 -->
        <var-bottom-navigation-item v-if="isLight" name="light" :label="$t('手电筒')" />
      </var-bottom-navigation>
    </div>
  </var-popup>
</template>

<script setup>
  import { computed, ref, onMounted, nextTick } from "vue";
  import { $mW, $t } from "../../common/utils/globalConfig";
  import { QrcodeStream, QrcodeCapture } from "vue-qrcode-reader";
  import _ from "lodash";
  //定义事件
  const emit = defineEmits(["update:show", "scan", "scanEvery"]);

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    //扫码模式 A.单次-自动关闭 B.连续-重复删除 C.连续-重复计数
    mode: {
      type: String,
      default: "A"
    },
    //扫码格式
    formats: {
      type: Array,
      default: []
    },
    //间隔时间毫秒  扫码模式：B和C时生效
    delayTime: {
      type: Number,
      default: 100
    },
    //扫码跟踪显示框
    track: {
      type: Boolean,
      default: false
    },
    //扫描参数 详见官网 https://gruhn.github.io/vue-qrcode-reader/demos/Simple.html
    constraints: {
      type: Object
    },
    //扫描图像发大缩小，0 摄像头自己
    scanZoom: {
      type: Number,
      default: 100
    },
    //是否支持相册
    isPhoto: {
      type: Boolean,
      default: true
    },
    //是否支持录入码
    isInput: {
      type: Boolean,
      default: true
    },
    //是否支持手电筒
    isLight: {
      type: Boolean,
      default: true
    },
    //动画效果
    isAnimation: {
      type: Boolean,
      default: true
    }
  });
  //
  const refQrcodeCapture = ref();
  //加载
  const loading = ref(false);
  //设备暂停
  const _paused = ref(true);
  //打开关闭窗口
  const _show = computed({
    get: () => {
      if (props.show) _paused.value = false;
      return props.show;
    },
    set: val => {
      emit("update:show", val);
    }
  });
  //扫码格式
  const _formats = computed(() => {
    return props.formats && props.formats.length > 0 ? props.formats : ["qr_code", "code_128", "code_39", "code_93", "ean_13", "ean_8"];
  });
  //扫描参数
  const _constraints = computed(() => {
    let _con = { facingMode: "environment" };
    if (props.constraints) _con = _.cloneDeep(props.constraints);
    if (!_con.facingMode) _con.facingMode = "environment";
    return _con;
  });
  //缩放比例
  const _scanZoom = computed(() => {
    if (props.scanZoom === 0) {
      return 0;
    } else {
      return props.scanZoom && props.scanZoom > 0 ? props.scanZoom : 100;
    }
  });
  //功能
  const dg = ref({
    active: "scan",
    scanInput: "",
    animation: false
  });
  //手电筒
  const _torch = ref(false);
  //扫描结果数据
  const _scanData = ref({ codeArr: [], codeCount: [], detectedCodes: [] });

  onMounted(() => {
    initData();
  });

  const initData = () => {
    loading.value = true;
  };

  //加载摄像头
  const onReady = capabilities => {
    loading.value = false;
    dg.value.animation = true;
  };

  //扫描结果
  const onDetect = detectedCodes => {
    processScanData(detectedCodes, false);
  };

  //处理扫描数据 扫码模式 A.单次-自动关闭 B.连续-重复删除 C.连续-重复计数
  const processScanData = (detectedCodes, photo) => {
    _paused.value = true;
    for (let i = 0; i < detectedCodes.length; i++) {
      let item = detectedCodes[i];
      if (props.mode === "A") {
        _scanData.value.codeArr.push(item.rawValue);
        _scanData.value.codeCount.push({ code: item.rawValue, count: 1 });
        _scanData.value.detectedCodes.push(item);
        emit("scanEvery", item.rawValue);
      } else if (props.mode === "B") {
        let _codeCount = _scanData.value.codeCount.find(r => r.code === item.rawValue);
        if (!_codeCount) {
          _scanData.value.codeArr.push(item.rawValue);
          _scanData.value.codeCount.push({ code: item.rawValue, count: 1 });
          _scanData.value.detectedCodes.push(item);
          emit("scanEvery", item.rawValue);
        }
      } else if (props.mode === "C") {
        let _codeCount = _scanData.value.codeCount.find(r => r.code === item.rawValue);
        if (_codeCount) {
          _codeCount.count = _codeCount.count + 1;
        } else {
          _scanData.value.codeArr.push(item.rawValue);
          _scanData.value.codeCount.push({ code: item.rawValue, count: 1 });
        }
        _scanData.value.detectedCodes.push(item);
        emit("scanEvery", item.rawValue);
      }
    }
    //模式处理
    if (props.mode === "A") {
      _show.value = false;
    } else if (photo) {
      _paused.value = false;
    } else {
      setTimeout(() => {
        _paused.value = false;
      }, props.delayTime);
    }
  };

  //上传图片处理
  const onDetectCapture = detectedCodes => {
    dg.value.active = "scan";
    processScanData(detectedCodes, true);
  };

  //错误信息
  const onError = error => {
    if (error.name === "NotAllowedError") {
      $mW($t("用户拒绝相机访问权限"));
    } else if (error.name === "NotFoundError") {
      $mW($t("未安装合适的摄像设备"));
    } else if (error.name === "NotSupportedError") {
      $mW($t("当前网页没有通过 HTTPS 或 localhost 安全协议提供服务"));
    } else if (error.name === "NotReadableError") {
      $mW($t("相机被占用了"));
    } else if (error.name === "OverconstrainedError") {
      _constraints.value.facingMode = "environment";
      $mW($t("尝试使用前置摄像头"));
    } else if (error.name === "StreamApiNotSupportedError") {
      $mW($t("浏览器似乎缺少功能"));
    } else if (error.name === "InsecureContextError") {
      $mW($t("请使用Https访问"));
    } else {
      $mW(error.name + ":" + error.message);
    }
    _show.value = false;
  };

  //扫描画框
  const onTrack = (detectedCodes, ctx) => {
    if (!props.track) return;
    for (const detectedCode of detectedCodes) {
      const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;
      ctx.strokeStyle = "#397bfe";
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (const { x, y } of otherPoints) {
        ctx.lineTo(x, y);
      }
      ctx.lineTo(firstPoint.x, firstPoint.y);
      ctx.closePath();
      ctx.stroke();
    }
  };

  //功能导航
  const handleNavChange = fCode => {
    if (fCode === "light") {
      dg.value.active = "scan";
      _torch.value = !_torch.value;
      _paused.value = false;
    } else if (fCode === "input") {
      _paused.value = true;
      dg.value.scanInput = "";
    } else if (fCode === "photo") {
      _paused.value = true;
      nextTick(() => {
        refQrcodeCapture.value.$el.removeAttribute("capture");
        if (props.mode === "A") {
          refQrcodeCapture.value.$el.removeAttribute("multiple");
        }
      });
    } else {
      _paused.value = false;
    }
  };

  //录入码
  const handelScanInputOkay = () => {
    if (!dg.value.scanInput) {
      $mW("请录入码");
    } else {
      if (props.mode === "A") {
        _scanData.value.codeArr.push(dg.value.scanInput);
        _scanData.value.codeCount.push({ code: dg.value.scanInput, count: 1 });
        emit("scanEvery", dg.value.scanInput);
        _show.value = false;
        dg.value.active = "scan";
      } else if (props.mode === "B") {
        let _codeCount = _scanData.value.codeCount.find(r => r.code === dg.value.scanInput);
        if (!_codeCount) {
          _scanData.value.codeArr.push(dg.value.scanInput);
          _scanData.value.codeCount.push({ code: dg.value.scanInput, count: 1 });
          emit("scanEvery", dg.value.scanInput);
          dg.value.active = "scan";
          _paused.value = false;
        } else {
          $mW("录入码重复");
        }
      } else if (props.mode === "C") {
        let _codeCount = _scanData.value.codeCount.find(r => r.code === dg.value.scanInput);
        if (_codeCount) {
          _codeCount.count = _codeCount.count + 1;
        } else {
          _scanData.value.codeArr.push(dg.value.scanInput);
          _scanData.value.codeCount.push({ code: dg.value.scanInput, count: 1 });
        }
        emit("scanEvery", dg.value.scanInput);
        dg.value.active = "scan";
        _paused.value = false;
      }
    }
  };

  //取消
  const handelScanInputCancel = () => {
    _paused.value = false;
    dg.value.active = "scan";
    dg.value.scanInput = "";
  };

  //关闭扫描
  const handleCloseForm = () => {
    _show.value = false;
  };

  const handleClose = () => {
    emit("scan", _.cloneDeep(_scanData.value));
    _scanData.value = { codeArr: [], codeCount: [], detectedCodes: [] };
    dg.value.active = "scan";
    dg.value.scanInput = "";
    dg.value.animation = false;
    _paused.value = true;
    if (props.mode === "A") {
      setTimeout(() => {
        _paused.value = false;
        setTimeout(() => {
          _paused.value = true;
        }, 10);
      }, 10);
    }
  };
</script>

<style scoped lang="scss">
  .top-loading {
    position: absolute;
    z-index: 3000;
    top: 40%;
    left: 40%;
  }

  .main-scan {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .main-input {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 3000;
    top: 25%;
    left: 0;
    width: 100%;
    padding: 10px 25px;
    background: #eaf0f6;
    font-size: var(--font-size);

    .row {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      width: 100%;

      .but {
        width: 80px;
        margin: 0 10px;
      }
    }

    .capture {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      width: 100%;
      height: 36px;
      font-size: var(--font-size);

      .input-file {
        font-size: var(--font-size);
      }
    }
  }

  .scanner-box {
    position: absolute;
    width: 100%;
    height: 60%;
    left: 0;
    top: 20%;
    overflow: hidden;
    z-index: 3000;
  }

  .scanner-line {
    height: 100%;
    width: 100%;
    background: linear-gradient(to bottom, rgba(0, 255, 51, 0) 90%, #00ff33 200%);
    animation: radar-beam 5s infinite;
  }

  @keyframes radar-beam {
    0% {
      transform: translateY(-100%);
    }
  }
</style>