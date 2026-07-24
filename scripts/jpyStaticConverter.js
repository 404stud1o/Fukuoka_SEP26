const JPY_TO_HKD = 0.0481;
document.getElementById("convRate").textContent = "¥100 JPY = $" + JPY_TO_HKD * 100 + " HKD";

const jpyInput = document.getElementById("jpyInput");
const hkdInput = document.getElementById("hkdInput");

jpyInput.addEventListener("input", () => {
    const val = parseFloat(jpyInput.value);
    hkdInput.value = isNaN(val) ? "" : (val * JPY_TO_HKD).toFixed(2);
});

hkdInput.addEventListener("input", () => {
    const val = parseFloat(hkdInput.value);
    jpyInput.value = isNaN(val) ? "" : (val / JPY_TO_HKD).toFixed(0);
});