<template>
  <div class="l-img-container" ref="containerRef" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @dblclick="resetZoom">
    <img :src="src" class="l-img" :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`, transition: transition }" />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from "vue";

  const props = defineProps({
    src: {
      type: String,
      default: ""
    }
  });

  const containerRef = ref(null);
  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const transition = ref("none");
  let _pinchStartDist = 0;
  let _pinchStartScale = 1;
  let _lastTapTime = 0;
  let _isPanning = false;
  let _isPinching = false;
  let _panStartX = 0;
  let _panStartY = 0;
  let _panStartTx = 0;
  let _panStartTy = 0;

  const _getPinchDist = touches => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = e => {
    transition.value = "none";
    if (e.touches.length === 2) {
      e.stopPropagation();
      _isPinching = true;
      _isPanning = false;
      _pinchStartDist = _getPinchDist(e.touches);
      _pinchStartScale = scale.value;
    } else if (e.touches.length === 1) {
      _isPinching = false;
      const now = Date.now();
      if (now - _lastTapTime < 300) {
        resetZoom();
        _isPanning = false;
      } else if (scale.value > 1) {
        e.stopPropagation();
        _isPanning = true;
        _panStartX = e.touches[0].clientX;
        _panStartY = e.touches[0].clientY;
        _panStartTx = translateX.value;
        _panStartTy = translateY.value;
      }
      _lastTapTime = now;
    }
  };

  const handleTouchEnd = e => {
    if (e.touches.length < 2) _isPinching = false;
    if (e.touches.length === 0) _isPanning = false;
  };

  const _handleTouchMove = e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      const ratio = _getPinchDist(e.touches) / _pinchStartDist;
      scale.value = Math.min(5, Math.max(0.5, _pinchStartScale * ratio));
    } else if (e.touches.length === 1 && _isPanning) {
      e.preventDefault();
      e.stopPropagation();
      translateX.value = _panStartTx + (e.touches[0].clientX - _panStartX);
      translateY.value = _panStartTy + (e.touches[0].clientY - _panStartY);
    }
  };

  const resetZoom = () => {
    transition.value = "transform 0.3s ease";
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };

  onMounted(() => {
    containerRef.value?.addEventListener("touchmove", _handleTouchMove, { passive: false });
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener("touchmove", _handleTouchMove);
  });
</script>

<style scoped lang="scss">
  .l-img-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .l-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
  }
</style>