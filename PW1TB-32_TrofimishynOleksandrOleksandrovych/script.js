const form = document.getElementById('fuelForm');
const selector = document.getElementById('taskSelector');
const task1 = document.getElementById('task1Inputs');
const task2 = document.getElementById('task2Inputs');
const results = document.getElementById('results');

selector.addEventListener('change', () => {
    task1.style.display = selector.value === "1" ? 'block' : 'none';
    task2.style.display = selector.value === "2" ? 'block' : 'none';
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    results.innerHTML = "";

    const data = Object.fromEntries(new FormData(form));
    const task = selector.value;

    const activeInputs = task === "1" ? task1.querySelectorAll('input') : task2.querySelectorAll('input');
    for (let input of activeInputs) {
        if (!input.value) {
            alert("Будь ласка, заповніть всі поля.");
            input.focus();
            return;
        }
    }

    if (task === "1") {
        const hydrogen_working = +data.HP;
        const carbon_working = +data.CP;
        const sulfur_working = +data.SP;
        const nitrogen_working = +data.NP;
        const oxygen_working = +data.OP;
        const moisture_working = +data.WP;
        const ash_working = +data.AP;

        const conversion_to_dry = 100 / (100 - moisture_working);
        const conversion_to_combustible = 100 / (100 - moisture_working - ash_working);

        const heating_value_working =
            339 * carbon_working + 1030 * hydrogen_working - 108.8 * (oxygen_working - sulfur_working) - 25 * moisture_working;
        const heating_value_working_mj = heating_value_working / 1000;
        const heating_value_dry =
            (heating_value_working + 25 * moisture_working) * 100 / (100 - moisture_working) / 1000;
        const heating_value_combustible =
            (heating_value_working + 25 * moisture_working) * 100 / (100 - moisture_working - ash_working) / 1000;


        const hydrogen_dry = hydrogen_working * conversion_to_dry;
        const carbon_dry = carbon_working * conversion_to_dry;
        const sulfur_dry = sulfur_working * conversion_to_dry;
        const nitrogen_dry = nitrogen_working * conversion_to_dry;
        const oxygen_dry = oxygen_working * conversion_to_dry;
        const ash_dry = ash_working * conversion_to_dry;

        const hydrogen_combustible = hydrogen_working * conversion_to_combustible;
        const carbon_combustible = carbon_working * conversion_to_combustible;
        const sulfur_combustible = sulfur_working * conversion_to_combustible;
        const nitrogen_combustible = nitrogen_working * conversion_to_combustible;
        const oxygen_combustible = oxygen_working * conversion_to_combustible;


        results.innerHTML = `
          <h2>Завдання 1: Результати</h2>
          <strong>Коефіцієнт до сухої маси:</strong><br>
          ${conversion_to_dry.toFixed(2)}<br>
          <strong>Коефіцієнт до горючої маси:</strong><br>
          ${conversion_to_combustible.toFixed(2)}<br>
    
          <strong>Склад сухої маси:</strong><br>
          H<sup>С</sup>: ${hydrogen_dry.toFixed(2)}%<br>
          C<sup>С</sup>: ${carbon_dry.toFixed(2)}%<br>
          S<sup>С</sup>: ${sulfur_dry.toFixed(2)}%<br>
          N<sup>С</sup>: ${nitrogen_dry.toFixed(2)}%<br>
          O<sup>С</sup>: ${oxygen_dry.toFixed(2)}%<br>
          A<sup>С</sup>: ${ash_dry.toFixed(2)}%<br>
    
          <strong>Склад горючої маси:</strong><br>
          H<sup>Г</sup>: ${hydrogen_combustible.toFixed(2)}%<br>
          C<sup>Г</sup>: ${carbon_combustible.toFixed(2)}%<br>
          S<sup>Г</sup>: ${sulfur_combustible.toFixed(2)}%<br>
          N<sup>Г</sup>: ${nitrogen_combustible.toFixed(2)}%<br>
          O<sup>Г</sup>: ${oxygen_combustible.toFixed(2)}%<br>
    
          <strong>Нижча теплота згоряння:</strong><br>
          Q<sup>P</sup> (робоча маса): ${heating_value_working_mj.toFixed(4)} МДж/кг<br>
          Q<sup>C</sup> (суха маса): ${heating_value_dry.toFixed(4)} МДж/кг<br>
          Q<sup>Г</sup> (горюча маса): ${heating_value_combustible.toFixed(4)} МДж/кг<br>
        `;
    } else {
        const carbon_combustible = +data.CG;
        const hydrogen_combustible = +data.HG;
        const oxygen_combustible = +data.OG;
        const sulfur_combustible = +data.SG;
        const heating_value_combustible = +data.Qdaf;

        const moisture_working = +data.WP2;
        const ash_dry = +data.Ad;
        const vanadium_combustible = +data.V;

        const conversion_factor = (100 - moisture_working - ash_dry) / 100;
        const ash_working = ash_dry * ((100 - moisture_working) / 100);
        const heating_value_working = heating_value_combustible * conversion_factor - 0.025 * moisture_working;

        const carbon_working = carbon_combustible * conversion_factor;
        const hydrogen_working = hydrogen_combustible * conversion_factor;
        const oxygen_working = oxygen_combustible * conversion_factor;
        const sulfur_working = sulfur_combustible * conversion_factor;

        const vanadium_working = vanadium_combustible * ((100 - moisture_working) / 100);

        results.innerHTML = `
          <h2>Завдання 2: Результати</h2>
          <strong>Склад робочої маси мазуту:</strong><br>
          C<sup>P</sup>: ${carbon_working.toFixed(2)}%<br>
          H<sup>P</sup>: ${hydrogen_working.toFixed(2)}%<br>
          O<sup>P</sup>: ${oxygen_working.toFixed(2)}%<br>
          S<sup>P</sup>: ${sulfur_working.toFixed(2)}%<br>
          A<sup>P</sup>: ${ash_working.toFixed(2)}%<br>
          V<sup>P</sup>: ${vanadium_working.toFixed(2)} мг/кг<br>
    
          <strong>Нижча теплота згоряння:</strong><br>
          Q<sup>P</sup> (робоча маса): ${heating_value_working.toFixed(4)} МДж/кг<br>
        `;
    }
});
