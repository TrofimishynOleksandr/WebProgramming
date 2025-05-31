document.getElementById('taskSelector').addEventListener('change', function () {
    document.querySelectorAll('.task-section').forEach(section => section.style.display = 'none');
    document.getElementById('task' + this.value).style.display = 'block';
});

document.getElementById('calculate').addEventListener('click', function () {
    const task = document.getElementById('taskSelector').value;
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (task === "1") {
        const l = parseFloat(document.querySelector('[name="l"]').value);
        const v110 = parseFloat(document.querySelector('[name="v110"]').value);
        const t110 = parseFloat(document.querySelector('[name="t110"]').value);
        const v10 = parseFloat(document.querySelector('[name="v10"]').value);
        const bus = parseFloat(document.querySelector('[name="bus"]').value);

        const w_oc = (0.007 * l) + (0.01 * v110) + (0.015 * t110) + (0.02 * v10) + (0.03 * bus);
        const t_voc = ((0.007 * l * 10) + (0.01 * v110 * 30) + (0.015 * t110 * 100) + (0.02 * v10 * 15) + (0.03 * bus * 2)) / w_oc;
        const k_aoc = w_oc * t_voc / 8760;
        const k_p_max = Math.max(
            l !== 0 ? 5.845 : 0,
            v110 !== 0 ? 3 : 0,
            t110 !== 0 ? 43 : 0,
            v10 !== 0 ? 4.95 : 0,
            bus !== 0 ? 0.835 : 0,
        );
        const k_p_oc = 1.2 * k_p_max / 8760;
        const w_dk = 2 * w_oc * (k_aoc + k_p_oc);
        const w_dc = w_dk + 0.02;

        results.innerHTML = `
            <strong>Частота відмов одноколової системи: </strong><br>
            ${w_oc.toFixed(4)} рік<sup>-1</sup><br>
            <strong>Середня тривалість відновлення: </strong><br>
            ${t_voc.toFixed(2)} год<br>
            <strong>Коефіцієнт аварійного простою: </strong><br>
            ${k_aoc.toExponential(4)}<br>
            <strong>Коефіцієнт планового простою: </strong><br>
            ${k_p_oc.toExponential(2)} год<br>
            <strong>Частота відмов одночасно двох кіл: </strong><br>
            ${w_dk.toExponential(4)} рік<sup>-1</sup><br>
            <strong>Частота відмов з урахуванням секц. вимикача: </strong><br>
            ${w_dc.toFixed(4)} рік<sup>-1</sup><br>`;

    } else if (task === "2") {
        const za = parseFloat(document.querySelector('[name="za"]').value);
        const zp = parseFloat(document.querySelector('[name="zp"]').value);
        const omega = parseFloat(document.querySelector('[name="omega"]').value);
        const tv = parseFloat(document.querySelector('[name="tv"]').value);
        const kp = parseFloat(document.querySelector('[name="kp"]').value);
        const pm = parseFloat(document.querySelector('[name="pm"]').value);
        const tm = parseFloat(document.querySelector('[name="tm"]').value);

        const Wa = omega * tv * pm * tm;
        const Wp = kp * pm * tm;
        const Z = Wa * za + Wp * zp;

        results.innerHTML = `
            <strong>Математичне сподівання аварійного недовідпущення: </strong><br>
            ${Wa.toFixed(2)} кВт·год<br>
            <strong>Математичне сподівання планового недовідпущення: </strong><br>
            ${Wp.toFixed(2)} кВт·год<br>
            <strong>Математичне сподівання збитків: </strong><br>
            ${Z.toFixed(2)} грн<br>`;
    }
});
