// A phone can retain a desktop-site preference and report a 980px layout.
// Correct that layout without changing the visitor's pinch-to-zoom setting.
export function mobileAppScale(viewportWidth: number, deviceWidth: number, touchPoints: number) {
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(deviceWidth)
    || touchPoints < 1 || deviceWidth < 240 || deviceWidth > 600
    || viewportWidth <= deviceWidth * 1.35) return 1;
  return Math.min(viewportWidth / deviceWidth, 4);
}
