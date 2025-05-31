document.getElementById('taskSelector').addEventListener('change', function () {
    document.querySelectorAll('.task-section').forEach(section => section.style.display = 'none');
    document.getElementById('task' + this.value).style.display = 'block';
});

document.getElementById('calculate').addEventListener('click', function () {
    const task = document.getElementById('taskSelector').value;
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (task === "1") {
        const U = parseFloat(document.querySelector('[name="voltage1"]').value);
        const Ikz = parseFloat(document.querySelector('[name="current1"]').value);
        const t = parseFloat(document.querySelector('[name="time"]').value);
        const S_load = parseFloat(document.querySelector('[name="s_load"]').value);
        const Tm = parseFloat(document.querySelector('[name="tm"]').value);

        const IM = (S_load / 2) / (Math.sqrt(3) * U);
        const Sek = IM / getJek(Tm);
        const Smin = (Ikz * 1000) * Math.sqrt(t) / 92;

        results.innerHTML = `
            <strong>Економічний переріз: </strong><br>
            s<sub>ек</sub> = ${Sek.toFixed(2)} мм<sup>2</sup><br>
            <strong>За термічною стійкістю: </strong><br>
            s >= s<sub>min</sub> = ${Smin.toFixed(2)} мм<sup>2</sup><br>`;

    } else if (task === "2") {
        const Skz = parseFloat(document.querySelector('[name="Skz"]').value);

        const Xc = Math.pow(10.5, 2) / Skz;
        const XT = Math.pow(10.5, 3) / (100 * 6.3);
        const XE = Xc + XT;
        const Ip0 = 10.5 / (Math.sqrt(3) * XE);

        results.innerHTML = `
            <strong>Початкове діюче значення струму трифазного КЗ: </strong><br>
            ${Ip0.toFixed(2)} кА<br>`;

    } else if (task === "3") {
        const Umax = parseFloat(document.querySelector('[name="Umax"]').value);
        const Unom = parseFloat(document.querySelector('[name="Unom"]').value);
        const Snom = parseFloat(document.querySelector('[name="Snom"]').value);
        const R1 = parseFloat(document.querySelector('[name="R1"]').value);
        const X1 = parseFloat(document.querySelector('[name="X1"]').value);
        const R2 = parseFloat(document.querySelector('[name="R2"]').value);
        const X2 = parseFloat(document.querySelector('[name="X2"]').value);

        const Xt = (Unom * Math.pow(Umax, 2)) / (100 * Snom);
        const Xsh = X1 + Xt;
        const Zsh = Math.sqrt(Math.pow(R1, 2) + Math.pow(Xsh, 2));
        const Xshmin = X2 + Xt;
        const Zshmin = Math.sqrt(Math.pow(R2, 2) + Math.pow(Xshmin, 2));
        const Ish3 = (Umax * 1000) / (Math.sqrt(3) * Zsh);
        const Ish2 = Ish3 * (Math.sqrt(3) / 2);
        const Ish3min = (Umax * 1000) / (Math.sqrt(3) * Zshmin);
        const Ish2min = Ish3min * (Math.sqrt(3) / 2);

        results.innerHTML = `
            <strong>Реактивний опір силового трансформатора: </strong><br>
            ${Xt.toFixed(2)} Ом<br>
            <strong>Опори в нормальному режимі: Z1 = </strong><br>
            Z = ${Zsh.toFixed(2)} Ом<br>
            X = ${Xsh.toFixed(2)} Ом<br>
            <strong>Опори в мінімальному режимі: Z2 = </strong><br>
            Z = ${Zshmin.toFixed(2)} Ом<br>
            X = ${Xshmin.toFixed(2)} Ом<br>
            <strong>Струми в нормальному режимі: I(3) = </strong><br>
            I(3) = ${Ish3.toFixed(2)} А<br>
            I(2) = ${Ish2.toFixed(2)} А<br>
            <strong>Струми в мінімальному режимі: I(3) = </strong><br>
            I(3) = ${Ish3min.toFixed(2)} А<br>
            I(2) = ${Ish2min.toFixed(2)} А<br>`;
    }

    function getJek(key) {
        if (key >= 1000 && key <= 3000) {
            return 1.6;
        } else if (key > 3000 && key <= 5000) {
            return 1.4;
        } else if (key > 5000) {
            return 1.2;
        } else {
            return NaN;
        }
    }
});
