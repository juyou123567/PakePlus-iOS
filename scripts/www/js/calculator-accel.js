const CalculatorAccel = {
    calculate(i) {
        const { speed, ax, ay, az, freq } = i;
        const resultant = Utils.round(Math.sqrt(ax * ax + ay * ay + az * az), 2);
        const ls = Math.abs(ax) <= 0.6 ? '优秀' : (Math.abs(ax) <= 1.0 ? '合格' : '超限');
        const vs = Math.abs(ay) <= 1.0 ? '优秀' : (Math.abs(ay) <= 1.5 ? '合格' : '超限');
        const rs = resultant <= 1.5 ? '优秀' : (resultant <= 2.5 ? '合格' : '超限');
        const lp = Math.abs(ax) <= 1.0, vp = Math.abs(ay) <= 1.5, rp = resultant <= 2.5;
        const passed = lp && vp && rp;
        let comfort, cc;
        if (ls === '优秀' && vs === '优秀' && rs === '优秀') { comfort = '优秀'; cc = '#27ae60'; }
        else if (passed) { comfort = '合格'; cc = '#f39c12'; }
        else { comfort = '超限'; cc = '#c0392b'; }
        let fv = null;
        if (freq !== null && !isNaN(freq) && freq > 0) fv = freq;
        let summary;
        if (passed) { summary = `✅ 合格 — 舒适度等级：${comfort}，合成加速度 ${resultant} m/s² ≤ 2.5 m/s²`; }
        else {
            const re = [];
            if (!lp) re.push(`横向加速度超限(${ax} m/s²)`);
            if (!vp) re.push(`垂向加速度超限(${ay} m/s²)`);
            if (!rp) re.push(`合成加速度超限(${resultant} m/s²)`);
            summary = '❌ 不合格 — ' + re.join('；');
        }
        return { resultant, comfort, comfortColor: cc, freqValue: fv, passed, details: { lateral: { value: ax, status: ls }, vertical: { value: ay, status: vs }, resultant: { value: resultant, status: rs } }, summary };
    },
    renderResult(cid, i, r) {
        const c = document.getElementById(cid); if (!c) return;
        const sc = r.passed ? 'pass' : 'fail';
        const st = r.passed ? '✅ 合格' : '❌ 不合格';
        const gsc = s => s === '优秀' ? '#27ae60' : s === '合格' ? '#f39c12' : '#c0392b';
        const mv = Math.max(Math.abs(i.ax), Math.abs(i.ay), Math.abs(i.az), r.resultant, 2.5);
        const bw = v => Math.min((Math.abs(v) / mv) * 100, 100);
        c.innerHTML = `<div class="result-header ${sc}"><span>车体加速度测算结果</span><span>${st}</span></div><div class="result-body"><p><strong>检测速度：</strong>${i.speed} km/h</p><p style="text-align:center;font-size:20px;margin:12px 0;"><strong>舒适度等级：</strong><span style="color:${r.comfortColor};font-size:26px;font-weight:800;">${r.comfort}</span></p><table><thead><tr><th>方向</th><th>加速度值</th><th>状态</th><th>图示</th></tr></thead><tbody><tr><td>横向 X</td><td>${i.ax}</td><td style="color:${gsc(r.details.lateral.status)};font-weight:600;">${r.details.lateral.status}</td><td><div style="background:#eee;height:10px;border-radius:5px;overflow:hidden;min-width:60px;"><div style="width:${bw(i.ax)}%;height:100%;background:${gsc(r.details.lateral.status)};border-radius:5px;"></div></div></td></tr><tr><td>垂向 Y</td><td>${i.ay}</td><td style="color:${gsc(r.details.vertical.status)};font-weight:600;">${r.details.vertical.status}</td><td><div style="background:#eee;height:10px;border-radius:5px;overflow:hidden;min-width:60px;"><div style="width:${bw(i.ay)}%;height:100%;background:${gsc(r.details.vertical.status)};border-radius:5px;"></div></div></td></tr><tr><td>纵向 Z</td><td>${i.az}</td><td style="color:#888;">—</td><td><div style="background:#eee;height:10px;border-radius:5px;overflow:hidden;min-width:60px;"><div style="width:${bw(i.az)}%;height:100%;background:#888;border-radius:5px;"></div></div></td></tr><tr style="background:#f8f9fa;"><td><strong>合成</strong></td><td><strong>${r.resultant}</strong></td><td style="color:${gsc(r.details.resultant.status)};font-weight:600;">${r.details.resultant.status}</td><td><div style="background:#eee;height:12px;border-radius:5px;overflow:hidden;min-width:60px;"><div style="width:${bw(r.resultant)}%;height:100%;background:${gsc(r.details.resultant.status)};border-radius:5px;"></div></div></td></tr></tbody></table>${r.freqValue !== null ? `<p><strong>振动频率：</strong>${r.freqValue} Hz</p>` : ''}<p style="margin-top:4px;font-size:11px;color:#888;">参考限值：横向≤1.0 | 垂向≤1.5 | 合成≤2.5 m/s²</p><p style="margin-top:8px;font-size:14px;"><strong>判定结论：</strong>${r.summary}</p></div><div class="result-actions"><button class="btn-primary" onclick="App.viewReport('accel')">📄 查看报告</button><button class="btn-secondary" onclick="App.saveCurrentResult('accel')">💾 保存结果</button></div>`;
    }
};