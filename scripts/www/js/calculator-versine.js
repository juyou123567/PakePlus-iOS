const CalculatorVersine = {
    calculate(i) {
        const { radius: r, chord, measured } = i;
        const theoretical = Utils.round((1000 * chord * chord) / (8 * r), 2);
        const diffs = measured.map(m => Utils.round(m - theoretical, 2));
        const cum = []; let cs = 0;
        for (const d of diffs) { cs = Utils.round(cs + d, 2); cum.push(cs); }
        const maxDiff = Utils.round(Math.max(...diffs.map(d => Math.abs(d))), 2);
        const maxCum = Utils.round(Math.max(...cum.map(d => Math.abs(d))), 2);
        const cons = [];
        for (let i = 0; i < diffs.length - 1; i++) cons.push(Math.abs(diffs[i + 1] - diffs[i]));
        const maxCons = cons.length > 0 ? Utils.round(Math.max(...cons), 2) : 0;
        const maxM = Math.max(...measured), minM = Math.min(...measured);
        const rangeM = Utils.round(maxM - minM, 2);
        const cp = maxCons <= 8, rp = rangeM <= 12, mp = maxDiff <= 6;
        const passed = cp && rp && mp;
        let summary;
        if (passed) { summary = '✅ 合格 — 各项指标均在容许范围内'; }
        else {
            const rea = [];
            if (!cp) rea.push(`正矢连续差超限(${maxCons}mm > 8mm)`);
            if (!rp) rea.push(`正矢最大最小值差超限(${rangeM}mm > 12mm)`);
            if (!mp) rea.push(`单点正矢差超限(${maxDiff}mm > 6mm)`);
            summary = '❌ 不合格 — ' + rea.join('；');
        }
        return { theoretical, differences: diffs, cumulativeDiffs: cum, maxDiff, maxCumulativeDiff: maxCum, maxConsecutiveDiff: maxCons, rangeMeasured: rangeM, passed, summary };
    },
    renderResult(cid, i, r) {
        const c = document.getElementById(cid); if (!c) return;
        const sc = r.passed ? 'pass' : 'fail';
        const st = r.passed ? '✅ 合格' : '❌ 不合格';
        const rows = i.measured.map((m, idx) => `<tr><td>${idx + 1}</td><td>${m}</td><td>${r.theoretical}</td><td class="${Math.abs(r.differences[idx]) > 6 ? 'val-danger' : ''}">${r.differences[idx]}</td><td>${r.cumulativeDiffs[idx]}</td></tr>`).join('');
        c.innerHTML = `<div class="result-header ${sc}"><span>曲线正矢测算结果</span><span>${st}</span></div><div class="result-body"><p><strong>曲线半径：</strong>${i.radius} m | <strong>弦长：</strong>${i.chord} m | <strong>测点间距：</strong>${i.spacing} m</p><p><strong>理论正矢：</strong><span class="val-highlight">${r.theoretical} mm</span></p><table><thead><tr><th>测点</th><th>实测值</th><th>理论值</th><th>正矢差</th><th>累计差</th></tr></thead><tbody>${rows}</tbody></table><p><strong>最大正矢差：</strong><span class="${r.maxDiff > 6 ? 'val-danger' : 'val-success'}">${r.maxDiff} mm</span>（≤6mm）</p><p><strong>最大累计差：</strong><span class="val-highlight">${r.maxCumulativeDiff} mm</span></p><p><strong>正矢连续差：</strong><span class="${r.maxConsecutiveDiff > 8 ? 'val-danger' : 'val-success'}">${r.maxConsecutiveDiff} mm</span>（≤8mm）</p><p><strong>实测最大-最小差：</strong><span class="${r.rangeMeasured > 12 ? 'val-danger' : 'val-success'}">${r.rangeMeasured} mm</span>（≤12mm）</p><p style="margin-top:8px;font-size:14px;"><strong>判定结论：</strong>${r.summary}</p></div><div class="result-actions"><button class="btn-primary" onclick="App.viewReport('versine')">📄 查看报告</button><button class="btn-secondary" onclick="App.saveCurrentResult('versine')">💾 保存结果</button></div>`;
    }
};