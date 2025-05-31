document.getElementById('solarForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    const Pc = parseFloat(data.Pc);
    const sigma1 = parseFloat(data.sigmaBefore);
    const sigma2 = parseFloat(data.sigmaAfter);
    const price = parseFloat(data.pricePerKWh);

    const hours = 24;
    const tolerance = 0.25;

    const deltaBefore = integrateNormal(Pc, sigma1, Pc - tolerance, Pc + tolerance);
    const deltaAfter = integrateNormal(Pc, sigma2, Pc - tolerance, Pc + tolerance);

    const W1 = Pc * hours * deltaBefore;
    const profit1 = W1 * price;

    const W2 = Pc * hours * (1 - deltaBefore);
    const penalty1 = W2 * price;
    const net1 = profit1 - penalty1;

    const W3 = Pc * hours * deltaAfter;
    const profit2 = W3 * price;

    const W4 = Pc * hours * (1 - deltaAfter);
    const penalty2 = W4 * price;
    const net2 = profit2 - penalty2;

    const diff = net2 - net1;

    function normalPdf(p, mean, sigma) {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * Math.pow((p - mean) / sigma, 2));
    }

    function integrateNormal(mean, sigma, from, to, step = 0.001) {
        let sum = 0;
        for (let x = from; x <= to; x += step) {
            sum += normalPdf(x, mean, sigma) * step;
        }
        return sum;
    }

    document.getElementById('results').innerHTML = `
        <h2>Результати</h2>
        <strong>Прибуток до вдосконалення:</strong><br> 
        ${net1.toFixed(2)} тис. грн<br>
        <strong>Прибуток після вдосконалення:</strong><br> 
        ${net2.toFixed(2)} тис. грн<br>
        <strong>Різниця прибутків:</strong><br> 
        ${diff.toFixed(2)} тис. грн<br>
      `;
});