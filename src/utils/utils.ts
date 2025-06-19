export function formatPopulationValue(value: number) {
  let formattedValue;

  if (value >= 1_000_000) {
    formattedValue = (value / 1_000_000_000).toFixed(2) + "M";
  } else if (value >= 1_000) {
    formattedValue = (value / 1_000).toFixed(1) + "K";
  } else {
    formattedValue = value.toString();
  }

  return formattedValue.replace(".", ",");
}
