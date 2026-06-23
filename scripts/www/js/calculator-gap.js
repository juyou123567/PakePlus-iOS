const CalculatorGap = {
    ALPHA: 0.0118,
    RAIL_TYPES: { '60': { name: '60kg/m', maxGap: 18 }, '50': { name: '50kg/m', maxGap: 18 }, '43': { name: '43kg/m', maxGap: 18 } },
    calculate(i) {
        const { railType, railLength, currentTemp, measuredGap, lockTemp } = i;
        const ri = this.RAIL_TYPES[railType] || this.RAIL_TYPES['60'];
        let tg = null, dev = null, passed = null, sm = '', summary = '';
        if (lockTemp !== null && !isNaN(lockTemp)) {
            const dt = currentTemp - lockTemp;
            tg = Utils.round(this.ALPHA * railLength * dt, 2);
            dev = Utils.round(measuredGap - tg, 2);
            const gw = Math.abs(dev) <= 3;
            const wm = measuredGap <= ri.maxGap;
            passed = gw && wm;
            if (passed) { sm = '轨缝正常'; summary = `✅ 合格 — 理论轨缝 ${tg}mm，实测偏差 ${dev}mm，在容许范围内`; }
            else {
                const re = [];
                if (!gw) re.push(`轨缝偏差超限(${dev}mm)`);
                if (!wm) re.push(`实测轨缝超构造轨缝(${measuredGap}mm > ${ri.maxGap}mm)`);
                sm = '轨缝异常'; summary = '❌ 不合格 — ' + re.join('；');
            }
        } else {
            passed = measuredGap <= ri.maxGap;
            if (passed) { sm = '轨缝合格（仅构造轨缝判定）'; summary = `✅ 合格 — 实测轨缝 ${measuredGap}mm ≤ 构造轨缝 ${ri.maxGap}mm（${ri.name}钢轨）`; }
            else { sm = '轨缝超限'; summary = `❌ 不合格 — 实测轨缝 ${measuredGap}mm 超出构造轨缝 ${ri.maxGap}mm（${ri.name}钢轨）`; }
        }
        if (tg !== null && tg < 0) summary += ' | ⚠️ 当前轨温低于锁定轨温，钢轨可能处于受压状态';
        return { theoreticalGap: tg, deviation: dev, passed, statusMessage: sm, maxGap: ri.maxGap, railTypeName: ri.name, summary };
    },
    renderResult(cid, i, r) {
        const c = document.getElementById(cid); if (!c) return;
        const sc = r.passed ? 'pass' : 'fail';
        const st = r.passed ? '✅ 合格' : '❌ 不合格';
        let dh = '';
        if (r.theoreticalGap !== null) {
            const dt = Utils.round(i.currentTemp - i.lockTemp, 1);
            dh = `<p><strong>锁定轨温：</strong>${i.lockTemp} °C | <strong>当前轨温：</strong>${i.currentTemp} °C</p><p><strong>温差 ΔT：</strong>${dt} °C</p><p><strong>线膨胀系数：</strong>${this.ALPHA} mm/(m·°C)</p><p><strong>理论轨缝：</strong><span class="val-highlight">${r.theoreticalGap} mm</span></p><p><strong>实测轨缝：</strong>${i.measuredGap} mm</p><p><strong>轨缝偏差：</strong><span class="${Math.abs(r.deviation) > 3 ? 'val-danger' : 'val-success'}">${r.deviation} mm</span></p>`;
        } else {
            dh = `<p><strong>实测轨缝：</strong>${i.measuredGap} mm</p><p><strong>当前轨温：</strong>${i.currentTemp} °C</p><p style="color:#888;">未提供锁定轨温，仅做构造轨缝判定</p>`;
        }
        c.innerHTML = `<div class="result-header ${sc}"><span>轨缝轨温测算结果</span><span>${st}</span></div><div class="result-body"><p><strong>钢轨类型：</strong>${r.railTypeName} | <strong>轨长：</strong>${i.railLength} m</p><p><strong>构造轨缝：</strong>${r.maxGap} mm</p>${dh}<p style="margin-top:8px;font-size:14px;"><strong>状态：</strong>${r.statusMessage}</p><p style="font-size:14px;"><strong>判定结论：</strong>${r.summary}</p></div><div class="result-actions"><button class="btn-primary" onclick="App.viewReport('gap')">📄 查看报告</button><button class="btn-secondary" onclick="App.saveCurrentResult('gap')">💾 保存结果</button></div>`;
    }
};