const CalculatorNoise = {
    STD_LIMITS: { day: { limit: 70, label: '昼间 (6:00-22:00)' }, night: { limit: 60, label: '夜间 (22:00-6:00)' } },
    calculate(i) {
        const { values, period } = i;
        if (values.length === 0) return { avg: 0, max: 0, min: 0, stdLimit: 0, periodLabel: '', passed: false, level: '无数据', summary: '请输入有效的噪声数值' };
        const avg = Utils.round(values.reduce((a, b) => a + b, 0) / values.length, 2);
        const max = Math.max(...values), min = Math.min(...values);
        const std = this.STD_LIMITS[period] || this.STD_LIMITS.day;
        const passed = avg <= std.limit;
        let level;
        if (avg <= std.limit * 0.85) level = '优';
        else if (avg <= std.limit) level = '达标';
        else if (avg <= std.limit + 5) level = '轻微超标';
        else if (avg <= std.limit + 10) level = '中度超标';
        else level = '严重超标';
        let summary;
        if (passed) { summary = `✅ 合格 — 平均噪声 ${avg} dB ≤ ${std.limit} dB（${std.label}标准）`; }
        else { const e = Utils.round(avg - std.limit, 2); summary = `❌ 不合格 — 平均噪声 ${avg} dB 超出标准 ${std.limit} dB，超标 ${e} dB`; }
        return { avg, max, min, stdLimit: std.limit, periodLabel: std.label, passed, level, summary };
    },
    renderResult(cid, i, r) {
        const c = document.getElementById(cid); if (!c) return;
        const sc = r.passed ? 'pass' : 'fail';
        const st = r.passed ? '✅ 合格' : '❌ 不合格';
        const lc = { '优': '#27ae60', '达标': '#27ae60', '轻微超标': '#f39c12', '中度超标': '#e67e22', '严重超标': '#c0392b' };
        const bars = i.values.map((v, idx) => {
            const pct = Math.min(v / 100 * 100, 100);
            const bc = v <= r.stdLimit ? '#27ae60' : (v <= r.stdLimit + 5 ? '#f39c12' : '#c0392b');
            return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><span style="font-size:11px;width:40px;text-align:right;">测点${idx + 1}</span><div style="flex:1;background:#eee;height:16px;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${bc};border-radius:4px;"></div></div><span style="font-size:12px;font-weight:600;width:45px;color:${bc};">${v} dB</span></div>`;
        }).join('');
        c.innerHTML = `<div class="result-header ${sc}"><span>噪音检测结果</span><span>${st}</span></div><div class="result-body"><p><strong>检测区域：</strong>${i.location || '未指定'} | <strong>时段：</strong>${r.periodLabel}</p><p><strong>标准限值：</strong>${r.stdLimit} dB</p><div style="margin:12px 0;"><p style="font-weight:600;margin-bottom:8px;">各测点噪声值：</p>${bars}</div><table style="margin-top:12px;"><tr><td><strong>平均值</strong></td><td class="${r.passed ? 'val-success' : 'val-danger'}">${r.avg} dB</td></tr><tr><td><strong>最大值</strong></td><td>${r.max} dB</td></tr><tr><td><strong>最小值</strong></td><td>${r.min} dB</td></tr><tr><td><strong>噪声等级</strong></td><td style="color:${lc[r.level] || '#333'};font-weight:700;">${r.level}</td></tr></table><p style="margin-top:8px;font-size:14px;"><strong>判定结论：</strong>${r.summary}</p></div><div class="result-actions"><button class="btn-primary" onclick="App.viewReport('noise')">📄 查看报告</button><button class="btn-secondary" onclick="App.saveCurrentResult('noise')">💾 保存结果</button></div>`;
    }
};