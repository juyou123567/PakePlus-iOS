const Report = {
    generateHtml(d) {
        let h = `<div class="report-meta">生成时间：${d.timestamp}</div><h4>📋 ${d.type}</h4>`;
        switch (d.typeKey) {
            case 'versine': h += this._vr(d); break;
            case 'corrugation': h += this._cr(d); break;
            case 'noise': h += this._nr(d); break;
            case 'gap': h += this._gr(d); break;
            case 'accel': h += this._ar(d); break;
            default: h += '<p>未知报告类型</p>';
        }
        h += '<hr style="border:0;border-top:1px dashed #dde4ea;margin:14px 0;"><p style="font-size:11px;color:#999;text-align:center;">途测智宝 — 工务一体化智能测算工具 生成</p>';
        return h;
    },
    _vr(d) {
        const { input: i, result: r } = d;
        const rows = i.measured.map((m, idx) => `<tr><td>${idx + 1}</td><td>${m}</td><td>${r.theoretical}</td><td>${r.differences[idx]}</td><td>${r.cumulativeDiffs[idx]}</td></tr>`).join('');
        return `<p><strong>输入参数：</strong>半径 ${i.radius}m | 弦长 ${i.chord}m | 测点间距 ${i.spacing}m</p><p><strong>理论正矢：</strong>${r.theoretical} mm</p><table><thead><tr><th>测点</th><th>实测(mm)</th><th>理论(mm)</th><th>正矢差(mm)</th><th>累计差(mm)</th></tr></thead><tbody>${rows}</tbody></table><p><strong>最大正矢差：</strong>${r.maxDiff} mm（≤6mm）</p><p><strong>正矢连续差：</strong>${r.maxConsecutiveDiff} mm（≤8mm）</p><p><strong>实测最大-最小差：</strong>${r.rangeMeasured} mm（≤12mm）</p><p style="font-weight:700;">判定：${r.summary}</p>`;
    },
    _cr(d) { const { input: i, result: r } = d; return `<p><strong>输入参数：</strong>波长 ${i.wavelength}mm | 波深 ${i.depth}mm | 轨型 ${i.railType}kg/m</p><p><strong>波磨指数：</strong>${r.index} ‰（容许≤${r.threshold}‰）</p><p style="font-weight:700;">判定：${r.summary}</p>`; },
    _nr(d) { const { input: i, result: r } = d; const pl = i.period === 'day' ? '昼间' : '夜间'; return `<p><strong>检测区域：</strong>${i.location || '未指定'}</p><p><strong>检测时段：</strong>${pl}（标准限值 ${r.stdLimit} dB）</p><p><strong>测点数值：</strong>${i.values.join(', ')} dB</p><p><strong>平均值：</strong>${r.avg} dB | <strong>最大值：</strong>${r.max} dB | <strong>最小值：</strong>${r.min} dB</p><p><strong>噪声等级：</strong>${r.level}</p><p style="font-weight:700;">判定：${r.summary}</p>`; },
    _gr(d) { const { input: i, result: r } = d; let e; if (r.theoreticalGap !== null) e = `<p><strong>锁定轨温：</strong>${i.lockTemp}°C | <strong>当前轨温：</strong>${i.currentTemp}°C</p><p><strong>理论轨缝：</strong>${r.theoreticalGap} mm | <strong>实测轨缝：</strong>${i.measuredGap} mm</p><p><strong>轨缝偏差：</strong>${r.deviation} mm</p>`; else e = `<p><strong>实测轨缝：</strong>${i.measuredGap} mm | <strong>构造轨缝：</strong>${r.maxGap} mm</p>`; return `<p><strong>钢轨类型：</strong>${r.railTypeName} | <strong>轨长：</strong>${i.railLength}m</p>${e}<p><strong>状态：</strong>${r.statusMessage}</p><p style="font-weight:700;">判定：${r.summary}</p>`; },
    _ar(d) { const { input: i, result: r } = d; return `<p><strong>检测速度：</strong>${i.speed} km/h</p><p><strong>横向加速度 X：</strong>${i.ax} m/s²（${r.details.lateral.status}）</p><p><strong>垂向加速度 Y：</strong>${i.ay} m/s²（${r.details.vertical.status}）</p><p><strong>纵向加速度 Z：</strong>${i.az} m/s²</p><p><strong>合成加速度：</strong>${r.resultant} m/s²（${r.details.resultant.status}）</p>${r.freqValue !== null ? `<p><strong>振动频率：</strong>${r.freqValue} Hz</p>` : ''}<p><strong>舒适度等级：</strong>${r.comfort}</p><p style="font-weight:700;">判定：${r.summary}</p>`; },
    showReport(d) { document.getElementById('reportContent').innerHTML = this.generateHtml(d); this.currentReportData = d; Utils.showModal('modalReport'); },
    printReport() {
        if (!this.currentReportData) return;
        const pw = window.open('', '_blank', 'width=700,height=600');
        pw.document.write(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>途测智宝 - 检测报告</title><style>body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;padding:20px;font-size:14px;color:#333}h3{color:#1a5276;border-bottom:2px solid #1a5276;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #ccc;padding:6px 10px;text-align:center;font-size:13px}th{background:#f0f3f5}.meta{color:#888;font-size:12px;margin-bottom:12px}hr{border:0;border-top:1px dashed #ccc;margin:14px 0}</style></head><body><h3>途测智宝 — 工务一体化智能测算报告</h3>${this.generateHtml(this.currentReportData)}</body></html>`);
        pw.document.close(); setTimeout(() => pw.print(), 300);
    },
    saveReport() {
        if (!this.currentReportData) return;
        let t = `途测智宝 — 工务一体化智能测算报告\n================================\n类型：${this.currentReportData.type}\n时间：${this.currentReportData.timestamp}\n--------------------------------\n`;
        const d = this.currentReportData;
        switch (d.typeKey) {
            case 'versine': t += `半径：${d.input.radius}m | 弦长：${d.input.chord}m\n理论正矢：${d.result.theoretical}mm\n最大正矢差：${d.result.maxDiff}mm | 连续差：${d.result.maxConsecutiveDiff}mm\n判定：${d.result.passed ? '合格' : '不合格'} — ${d.result.summary}\n`; break;
            case 'corrugation': t += `波磨指数：${d.result.index}‰ (容许≤${d.result.threshold}‰)\n判定：${d.result.passed ? '合格' : '不合格'}\n`; break;
            case 'noise': t += `平均噪声：${d.result.avg}dB | 等级：${d.result.level}\n判定：${d.result.passed ? '合格' : '不合格'}\n`; break;
            case 'gap': t += `实测轨缝：${d.input.measuredGap}mm\n判定：${d.result.passed ? '合格' : '不合格'} — ${d.result.summary}\n`; break;
            case 'accel': t += `合成加速度：${d.result.resultant}m/s² | 舒适度：${d.result.comfort}\n判定：${d.result.passed ? '合格' : '不合格'}\n`; break;
        }
        t += '--------------------------------\n途测智宝 生成\n';
        const b = new Blob([t], { type: 'text/plain;charset=utf-8' }), u = URL.createObjectURL(b);
        const a = document.createElement('a'); a.href = u; a.download = `检测报告_${d.typeKey}_${Utils.formatDate()}.txt`;
        a.click(); URL.revokeObjectURL(u); Utils.showToast('报告已保存');
    }
};