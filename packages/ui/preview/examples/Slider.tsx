import { Slider } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 480 }}>
      <Slider
        label="Volume"
        defaultValue={[62]}
        showValue
        showSteppers
        stepperStep={5}
        formatValue={(v) => `${v}%`}
      />
      <Slider label="Quiet hours" defaultValue={[22, 80]} thumbLabels={["Start", "End"]} showValue />
    </div>
  );
}
