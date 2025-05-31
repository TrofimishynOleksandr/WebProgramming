document.getElementById('emissionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(this));
    const coalAmount = parseFloat(data.coalAmount);
    const oilAmount = parseFloat(data.oilAmount);
    const gasAmount = parseFloat(data.gasAmount);

    // Вугілля (Донецьке газове, марка ГР)
    const coal = {
        Qri: 20.47,
        flyAshFraction: 0.8,
        ashContent: 25.2,
        combustionLoss: 1.5,
        efficiency: 0.985,
        amount: coalAmount || 0
    };

    // Мазут високосірчистий, марка 40
    const oil = {
        Qri: 39.48,
        flyAshFraction: 1.0,
        ashContent: 0.15,
        combustionLoss: 0,
        efficiency: 0.985,
        amount: oilAmount || 0
    };

    // Природний газ (немає твердих частинок)
    const gas = {
        emissionFactor: 0,
        amount: gasAmount || 0,
        grossEmission: 0
    };

    function calculateEmission(fuel) {
        const emissionFactor = Math.pow(10, 6) / fuel.Qri *
            fuel.flyAshFraction *
            fuel.ashContent / (100 - fuel.combustionLoss) *
            (1 - fuel.efficiency);

        const grossEmission = Math.pow(10, -6) * emissionFactor * fuel.Qri * fuel.amount;

        return {
            emissionFactor: emissionFactor.toFixed(2),
            grossEmission: grossEmission.toFixed(2)
        };
    }

    const coalRes = calculateEmission(coal);
    const oilRes = calculateEmission(oil);
    const gasRes = {
        emissionFactor: gas.emissionFactor.toFixed(2),
        grossEmission: gas.grossEmission.toFixed(2)
    };

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Результати</h2>
        <strong>Вугілля (марка ГР):</strong><br>
        Показник емісії: ${coalRes.emissionFactor} г/ГДж<br>
        Валовий викид: ${coalRes.grossEmission} т<br><br>
    
        <strong>Мазут (марка 40):</strong><br>
        Показник емісії: ${oilRes.emissionFactor} г/ГДж<br>
        Валовий викид: ${oilRes.grossEmission} т<br><br>
    
        <strong>Природний газ:</strong><br>
        Показник емісії: ${gasRes.emissionFactor} г/ГДж<br>
        Валовий викид: ${gasRes.grossEmission} т
      `;
});
