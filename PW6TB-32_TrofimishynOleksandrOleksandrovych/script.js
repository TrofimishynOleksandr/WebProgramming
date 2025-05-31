document.getElementById('loadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const resultEl = document.getElementById('results');
    resultEl.innerHTML = "";

    const total_nPn = parseFloat(document.getElementById("totalPower").value) || 0;
    const total_nPnKv = parseFloat(document.getElementById("totalUsedPower").value) || 0;
    const total_nPnKvTg = parseFloat(document.getElementById("totalReactive").value) || 0;
    const total_nPn2 = parseFloat(document.getElementById("totalPowerSquare").value) || 0;

    const rows = document.querySelectorAll("#deviceTable tbody tr");

    const bigNames = ["Зварювальний трансформатор", "Сушильна шафа"];
    let hrData = [];
    let bigData = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const name = cells[0].textContent.trim();
        const values = Array.from(cells).slice(1).map(c => parseFloat(c.querySelector("input").value));
        const [eta, cosPhi, Un, n, Pn, Kv, tgPhi] = values;
        const item = { name, eta, cosPhi, Un, n, Pn, Kv, tgPhi };
        if (bigNames.includes(name)) bigData.push(item);
        else hrData.push(item);
    });

    let output = "<h3>Струми рівня I:</h3>";

    let sum_n = 0, sum_Un = 0, sum_nPn = 0, sum_nPnKv = 0, sum_nPnKvTg = 0, sum_nPn2 = 0;

    hrData.forEach(dev => {
        const nPn = dev.n * dev.Pn;
        const Ir = nPn / (Math.sqrt(3) * dev.Un * dev.cosPhi * dev.eta);
        output += `<strong>${dev.name}:</strong> I<sub>р</sub> = ${Ir.toFixed(2)} А<br>`;

        sum_n += dev.n;
        sum_Un += dev.Un;
        sum_nPn += nPn;
        sum_nPnKv += dev.n * dev.Pn * dev.Kv;
        sum_nPnKvTg += dev.n * dev.Pn * dev.Kv * dev.tgPhi;
        sum_nPn2 += dev.n * dev.Pn * dev.Pn;
    });

    bigData.forEach(dev => {
        const nPn = dev.n * dev.Pn;
        const Ir = nPn / (Math.sqrt(3) * dev.Un * dev.cosPhi * dev.eta);
        output += `<strong>${dev.name}:</strong> I<sub>р</sub> = ${Ir.toFixed(2)} А<br>`;
    });

    const groupKv = sum_nPnKv / sum_nPn;
    const ne = sum_nPn * sum_nPn / sum_nPn2;
    const kr = getkrM(ne, groupKv);
    const pr = kr * sum_nPnKv;
    const qr = sum_nPnKvTg;
    const sr = Math.sqrt(pr * pr + qr * qr);
    const ir = pr / (sum_Un / hrData.length);

    const totalKv = total_nPnKv / total_nPn;
    const totalNe = total_nPn * total_nPn / total_nPn2;
    const totalKr = getkrT(totalNe, totalKv);
    const totalPr = totalKr * total_nPnKv;
    const totalQr = totalKr * total_nPnKvTg;
    const totalSr = Math.sqrt(totalPr * totalPr + totalQr * totalQr);
    const totalIr = totalPr / 0.38;

    output += `
        <br><strong>Груповий коефіцієнт використання для ШР1=ШР2=ШР3:</strong> ${groupKv.toFixed(4)}<br>
        <strong>Ефективна кількість ЕП для ШР1=ШР2=ШР3:</strong> ${ne.toFixed(0)}<br>
        <strong>Розрахунковий коефіцієнт активної потужності для ШР1=ШР2=ШР3:</strong> ${kr.toFixed(2)}<br>
        <strong>Розрахункове активне навантаження для ШР1=ШР2=ШР3:</strong> ${pr.toFixed(2)} кВт<br>
        <strong>Розрахункове реактивне навантаження для ШР1=ШР2=ШР3:</strong> ${qr.toFixed(2)} квар<br>
        <strong>Повна потужність для ШР1=ШР2=ШР3:</strong> ${sr.toFixed(2)} кВ·А<br>
        <strong>Розрахунковий груповий струм для ШР1=ШР2=ШР3:</strong> ${ir.toFixed(2)} А<br><br>
        <strong>Коефіцієнти використання цеху в цілому:</strong> ${totalKv.toFixed(2)}<br>
        <strong>Ефективна кількість ЕП цеху в цілому:</strong> ${totalNe.toFixed(0)}<br>
        <strong>Розрахунковий коефіцієнт активної потужності цеху в цілому:</strong> ${totalKr.toFixed(2)}<br>
        <strong>Розрахункове активне навантаження на шинах 0,38 кВ ТП:</strong> ${totalPr.toFixed(2)} кВт<br>
        <strong>Розрахункове реактивне навантаження на шинах 0,38 кВ ТП:</strong> ${totalQr.toFixed(2)} квар<br>
        <strong>Повна потужність на шинах 0,38 кВ ТП:</strong> ${totalSr.toFixed(2)} кВ·А<br>
        <strong>Розрахунковий груповий струм на шинах 0,38 кВ ТП:</strong> ${totalIr.toFixed(2)} А<br>
      `;

    resultEl.innerHTML = output;

    function getkrM(ne, Kv) {
        const neValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 50, 60, 80, 100];

        const kvValues = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

        const krTable = [
            [8.00, 5.33, 4.00, 2.67, 2.00, 1.60, 1.33, 1.14, 1.00],
            [6.22, 4.33, 3.39, 2.45, 1.98, 1.60, 1.33, 1.14, 1.00],
            [4.06, 2.89, 2.31, 1.74, 1.45, 1.34, 1.22, 1.14, 1.00],
            [3.24, 2.35, 1.91, 1.47, 1.25, 1.21, 1.12, 1.06, 1.00],
            [2.84, 2.09, 1.72, 1.35, 1.16, 1.16, 1.08, 1.03, 1.00],
            [2.64, 1.96, 1.62, 1.28, 1.14, 1.13, 1.06, 1.01, 1.00],
            [2.49, 1.86, 1.54, 1.23, 1.12, 1.10, 1.04, 1.00, 1.00],
            [2.37, 1.78, 1.48, 1.19, 1.10, 1.08, 1.02, 1.00, 1.00],
            [2.27, 1.71, 1.43, 1.16, 1.09, 1.07, 1.01, 1.00, 1.00],
            [2.18, 1.65, 1.39, 1.13, 1.07, 1.05, 1.00, 1.00, 1.00],
            [2.04, 1.56, 1.32, 1.08, 1.05, 1.03, 1.00, 1.00, 1.00],
            [1.94, 1.49, 1.27, 1.05, 1.02, 1.00, 1.00, 1.00, 1.00],
            [1.85, 1.43, 1.23, 1.02, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.78, 1.39, 1.19, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.72, 1.35, 1.16, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.60, 1.27, 1.10, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.51, 1.21, 1.05, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.44, 1.16, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.40, 1.13, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.30, 1.07, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.25, 1.03, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.20, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.16, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]
        ];

        function findClosestValue(value, arr) {
            return arr.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
        }

        const closestNe = findClosestValue(ne, neValues);
        const closestKv = findClosestValue(Kv, kvValues);

        const neIndex = neValues.indexOf(closestNe);
        const kvIndex = kvValues.indexOf(closestKv);

        return krTable[neIndex][kvIndex];
    }

    function getkrT(ne, Kv) {
        const table = [
            { range: [0, 1], values: [8.00, 5.33, 4.00, 2.67, 2.00, 1.60, 1.33, 1.14] },
            { range: [2, 2], values: [5.01, 3.44, 2.69, 1.90, 1.52, 1.24, 1.11, 1.00] },
            { range: [3, 3], values: [2.40, 2.17, 1.80, 1.42, 1.23, 1.14, 1.08, 1.00] },
            { range: [4, 4], values: [2.28, 1.73, 1.46, 1.19, 1.06, 1.04, 1.00, 0.97] },
            { range: [5, 5], values: [1.31, 1.12, 1.02, 1.00, 0.98, 0.96, 0.94, 0.93] },
            { range: [6, 8], values: [1.20, 1.00, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91] },
            { range: [9, 10], values: [1.10, 0.97, 0.91, 0.90, 0.90, 0.90, 0.90, 0.90] },
            { range: [10, 25], values: [0.80, 0.80, 0.80, 0.85, 0.85, 0.85, 0.85, 0.90] },
            { range: [25, 50], values: [0.75, 0.75, 0.75, 0.75, 0.75, 0.80, 0.85, 0.85] },
            { range: [51, Infinity], values: [0.65, 0.65, 0.65, 0.70, 0.70, 0.75, 0.80, 0.80] }
        ];

        const Kv_values = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];

        const row = table.find(({ range }) => ne >= range[0] && ne <= range[1]);

        if (!row) return null;

        let KvIndex = Kv_values.findIndex(value => Kv <= value);
        if (KvIndex === -1) KvIndex = Kv_values.length - 1;

        return row.values[KvIndex];
    }
});
