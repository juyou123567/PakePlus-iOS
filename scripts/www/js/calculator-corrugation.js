const CalculatorCorrugation = {
    THRESHOLDS: { '60': { limit: 4.0, name: '60kg/m' }, '50': { limit: 5.0, name: '50kg/m' }, '43': { limit: 6.0, name: '43kg/m' } },
    calculate(i) {
        const { wavelength: w, depth, railType } = i;
        const index = Utils.round((depth / w) * 1000, 2);
        const th = this.THRESHOLDS[railType] || this.THRESHOLDS['60'];
        const passed = index <= th.limit;
        let summary;
        if (passed) { summary = `✅ 合格 — 波磨指数 ${index}‰ ≤ 容许值 ${th.limit}‰（${th.name}钢轨）`; }
        else { const e = Utils.round(index - th.limit, 2); summary = `❌ 不合格 — 波磨指数 ${index}‰ 超出容许值 ${th.limit}‰，超限 ${e}‰`; }
        return { index, threshold: th.limit, railTypeName: th.name, passed, summary };
    },
    renderResult(cid, i, r) {
        const c = document.getElementById(cid); if (!c) return;
        const sc = r.passed ? 'pass' : 'fail';
        const st = r.passed ? '✅ 合格' : '❌ 不合格';
        c.innerHTML = `<div class="result-header ${sc}"><span>波磨量计算结果</span><span>${st}</span></div><div class="result-body"><p><strong>波磨波长：</strong>${i.wavelength} mm | <strong>波深：</strong>${i.depth} mm</p><p><strong>钢轨类型：</strong>${r.railTypeName} | <strong>容许值：</strong>${r.threshold}‰</p><p style="font-size:18px;text-align:center;margin:12px 0;"><strong>波磨指数：</strong><span class="${r.passed ? 'val-success' : 'val-danger'}" style="font-size:22px;">${r.index} ‰</span></p><p style="font-size:14px;"><strong>判定结论：</strong>${r.summary}</p></div><div class="result-actions"><button class="btn-primary" onclick="App.viewReport('corrugation')">📄 查看报告</button><button class="btn-secondary" onclick="App.saveCurrentResult('corrugation')">💾 保存结果</button></div>`;
    }
};