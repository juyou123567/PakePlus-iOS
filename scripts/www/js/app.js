const App = {
    _lastResult: null, _lastInput: null, _lastType: null,
    init() {
        Bluetooth.init();
        this._bindNav(); this._bindCards(); this._bindCalcs();
        this._bindBtModal(); this._bindRpModal(); this._bindHistory();
        this.updateHistoryCount();
    },
    _bindNav() { document.querySelectorAll('.nav-item[data-nav]').forEach(i => i.addEventListener('click', () => this.navigateTo(i.dataset.nav))); },
    _bindCards() {
        document.querySelectorAll('.func-card[data-page]').forEach(c => c.addEventListener('click', () => this.navigateTo(c.dataset.page)));
        document.getElementById('btnHistory').addEventListener('click', () => this.navigateTo('history'));
    },
    navigateTo(p) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const tp = document.getElementById('page-' + p); if (tp) tp.classList.add('active');
        document.querySelectorAll('.nav-item[data-nav]').forEach(n => n.classList.remove('active'));
        if (p === 'home') { const n = document.querySelector('.nav-item[data-nav="home"]'); if (n) n.classList.add('active'); }
        else if (p === 'history') { const n = document.querySelector('.nav-item[data-nav="history"]'); if (n) n.classList.add('active'); }
        window.scrollTo(0, 0);
        if (p === 'history') this.renderHistory();
        this.updateHistoryCount();
    },
    _bindCalcs() {
        document.getElementById('btnCalcVersine').addEventListener('click', () => this._calcVersine());
        document.getElementById('btnCalcCorrugation').addEventListener('click', () => this._calcCorrugation());
        document.getElementById('btnCalcNoise').addEventListener('click', () => this._calcNoise());
        document.getElementById('btnCalcGap').addEventListener('click', () => this._calcGap());
        document.getElementById('btnCalcAccel').addEventListener('click', () => this._calcAccel());
        document.querySelectorAll('.btn-back').forEach(b => b.addEventListener('click', () => this.navigateTo(b.dataset.back)));
    },
    _calcVersine() {
        const r = parseFloat(document.getElementById('v-radius').value);
        const ch = parseFloat(document.getElementById('v-chord').value);
        const sp = parseFloat(document.getElementById('v-spacing').value);
        if (isNaN(r) || r <= 0) { Utils.showToast('请输入有效的曲线半径'); return; }
        if (isNaN(ch) || ch <= 0) { Utils.showToast('请输入有效的弦长'); return; }
        const m = Utils.parseNumberLines(document.getElementById('v-measured').value);
        if (m.length < 2) { Utils.showToast('请至少输入2个实测正矢值'); return; }
        const i = { radius: r, chord: ch, spacing: sp, measured: m };
        const re = CalculatorVersine.calculate(i);
        CalculatorVersine.renderResult('resultVersine', i, re);
        this._lastInput = i; this._lastResult = re; this._lastType = 'versine';
    },
    _calcCorrugation() {
        const w = parseFloat(document.getElementById('c-wavelength').value);
        const de = parseFloat(document.getElementById('c-depth').value);
        const rt = document.getElementById('c-rail-type').value;
        if (isNaN(w) || w <= 0) { Utils.showToast('请输入有效的波磨波长'); return; }
        if (isNaN(de) || de <= 0) { Utils.showToast('请输入有效的波深'); return; }
        const i = { wavelength: w, depth: de, railType: rt };
        const re = CalculatorCorrugation.calculate(i);
        CalculatorCorrugation.renderResult('resultCorrugation', i, re);
        this._lastInput = i; this._lastResult = re; this._lastType = 'corrugation';
    },
    _calcNoise() {
        const lo = document.getElementById('n-location').value.trim();
        const v = Utils.parseNumberLines(document.getElementById('n-values').value);
        const pe = document.getElementById('n-period').value;
        if (v.length === 0) { Utils.showToast('请至少输入1个噪声数值'); return; }
        const i = { location: lo, values: v, period: pe };
        const re = CalculatorNoise.calculate(i);
        CalculatorNoise.renderResult('resultNoise', i, re);
        this._lastInput = i; this._lastResult = re; this._lastType = 'noise';
    },
    _calcGap() {
        const rt = document.getElementById('g-rail-type').value;
        const rl = parseFloat(document.getElementById('g-rail-length').value);
        const ct = parseFloat(document.getElementById('g-temp').value);
        const mg = parseFloat(document.getElementById('g-gap').value);
        const lr = document.getElementById('g-lock-temp').value;
        if (isNaN(rl) || rl <= 0) { Utils.showToast('请输入有效的钢轨长度'); return; }
        if (isNaN(ct)) { Utils.showToast('请输入当前轨温'); return; }
        if (isNaN(mg) || mg < 0) { Utils.showToast('请输入有效的实测轨缝值'); return; }
        let lt = null;
        if (lr.trim() !== '') { lt = parseFloat(lr); if (isNaN(lt)) lt = null; }
        const i = { railType: rt, railLength: rl, currentTemp: ct, measuredGap: mg, lockTemp: lt };
        const re = CalculatorGap.calculate(i);
        CalculatorGap.renderResult('resultGap', i, re);
        this._lastInput = i; this._lastResult = re; this._lastType = 'gap';
    },
    _calcAccel() {
        const sp = parseFloat(document.getElementById('a-speed').value);
        const ax = parseFloat(document.getElementById('a-x').value);
        const ay = parseFloat(document.getElementById('a-y').value);
        const az = parseFloat(document.getElementById('a-z').value);
        const fr = document.getElementById('a-freq').value;
        if (isNaN(sp) || sp <= 0) { Utils.showToast('请输入有效的检测速度'); return; }
        if (isNaN(ax) || isNaN(ay) || isNaN(az)) { Utils.showToast('请输入完整的加速度数据'); return; }
        let f = null;
        if (fr.trim() !== '') { f = parseFloat(fr); if (isNaN(f) || f <= 0) f = null; }
        const i = { speed: sp, ax, ay, az, freq: f };
        const re = CalculatorAccel.calculate(i);
        CalculatorAccel.renderResult('resultAccel', i, re);
        this._lastInput = i; this._lastResult = re; this._lastType = 'accel';
    },
    _bindBtModal() {
        document.getElementById('btnBluetooth').addEventListener('click', () => Utils.showModal('modalBluetooth'));
        document.getElementById('btnCloseBtModal').addEventListener('click', () => Utils.hideModal('modalBluetooth'));
        document.getElementById('btnScanDevice').addEventListener('click', () => Bluetooth.scanDevices());
        document.getElementById('btnSimulateData').addEventListener('click', () => Bluetooth.simulateData());
        document.getElementById('modalBluetooth').addEventListener('click', e => { if (e.target === e.currentTarget) Utils.hideModal('modalBluetooth'); });
    },
    _bindRpModal() {
        document.getElementById('btnCloseReport').addEventListener('click', () => Utils.hideModal('modalReport'));
        document.getElementById('btnPrintReport').addEventListener('click', () => Report.printReport());
        document.getElementById('btnSaveReport').addEventListener('click', () => Report.saveReport());
        document.getElementById('modalReport').addEventListener('click', e => { if (e.target === e.currentTarget) Utils.hideModal('modalReport'); });
    },
    _bindHistory() {
        document.getElementById('btnClearHistory').addEventListener('click', () => {
            if (confirm('确定清空所有历史测算记录？此操作不可撤销。')) {
                Storage.clearAll(); this.renderHistory(); this.updateHistoryCount();
                Utils.showToast('记录已清空');
            }
        });
        document.getElementById('btnExportAll').addEventListener('click', () => { this._exportExcel(); });
    },
    _exportExcel() {
        const recs = Storage.getAll();
        if (recs.length === 0) { Utils.showToast('暂无记录可导出'); return; }
        let csv = '\uFEFF序号,测算类型,时间,判定结果,关键指标1,关键指标2,关键指标3,详细摘要\n';
        recs.forEach((r, i) => {
            const p = r.result.passed ? '合格' : '不合格';
            let k1 = '', k2 = '', k3 = '';
            switch (r.typeKey) {
                case 'versine': k1 = `最大正矢差:${r.result.maxDiff}mm`; k2 = `连续差:${r.result.maxConsecutiveDiff}mm`; k3 = `最大-最小差:${r.result.rangeMeasured}mm`; break;
                case 'corrugation': k1 = `波磨指数:${r.result.index}‰`; k2 = `容许值:≤${r.result.threshold}‰`; k3 = ''; break;
                case 'noise': k1 = `平均值:${r.result.avg}dB`; k2 = `最大值:${r.result.max}dB`; k3 = `等级:${r.result.level}`; break;
                case 'gap': k1 = `实测轨缝:${r.input.measuredGap}mm`; k2 = r.result.theoreticalGap !== null ? `理论轨缝:${r.result.theoreticalGap}mm` : `状态:${r.result.statusMessage}`; k3 = r.result.deviation !== null ? `偏差:${r.result.deviation}mm` : ''; break;
                case 'accel': k1 = `合成加速度:${r.result.resultant}m/s²`; k2 = `舒适度:${r.result.comfort}`; k3 = r.result.freqValue !== null ? `频率:${r.result.freqValue}Hz` : ''; break;
            }
            const summary = (r.result.summary || '').replace(/,/g, '，');
            csv += `${i + 1},${r.type},${r.timestamp},${p},${k1},${k2},${k3},"${summary}"\n`;
        });
        const b = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const u = URL.createObjectURL(b);
        const a = document.createElement('a'); a.href = u;
        a.download = `途测智宝_全部记录_${Utils.formatDate()}.csv`;
        a.click(); URL.revokeObjectURL(u);
        Utils.showToast('✅ 已导出Excel表格');
    },
    renderHistory() {
        const c = document.getElementById('historyList');
        const recs = Storage.getAll();
        if (recs.length === 0) { c.innerHTML = '<p class="empty-hint">暂无测算记录</p>'; return; }
        c.innerHTML = recs.map(r => {
            const sc = r.result.passed ? 'pass' : 'fail';
            const st = r.result.passed ? '合格' : '不合格';
            let sm = '';
            switch (r.typeKey) {
                case 'versine': sm = `最大正矢差：${r.result.maxDiff}mm | 连续差：${r.result.maxConsecutiveDiff}mm`; break;
                case 'corrugation': sm = `波磨指数：${r.result.index}‰ (容许≤${r.result.threshold}‰)`; break;
                case 'noise': sm = `平均噪声：${r.result.avg}dB | 等级：${r.result.level}`; break;
                case 'gap': sm = `实测轨缝：${r.input.measuredGap}mm | ${r.result.statusMessage}`; break;
                case 'accel': sm = `合成加速度：${r.result.resultant}m/s² | 舒适度：${r.result.comfort}`; break;
                default: sm = r.result.summary || '';
            }
            return `<div class="history-item" data-id="${r.id}" data-type="${r.typeKey}"><div class="hi-header"><span class="hi-type">${r.type}</span><span class="hi-time">${r.timestamp}</span></div><div class="hi-summary">${sm}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;"><span class="hi-badge ${sc}">${st}</span><button class="btn-secondary" style="font-size:12px;padding:4px 10px;" data-action="delete" data-id="${r.id}">删除</button></div></div>`;
        }).join('');
        c.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.closest('[data-action="delete"]')) return;
                const rec = Storage.getAll().find(r => r.id === item.dataset.id);
                if (rec) Report.showReport(rec);
            });
        });
        c.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation(); Storage.delete(btn.dataset.id);
                this.renderHistory(); this.updateHistoryCount();
                Utils.showToast('记录已删除');
            });
        });
    },
    updateHistoryCount() {
        const c = Storage.count();
        const el = document.getElementById('historyCount');
        if (el) { el.textContent = c; el.style.display = c > 0 ? 'inline' : 'none'; }
    },
    viewReport() {
        if (!this._lastInput || !this._lastResult || !this._lastType) { Utils.showToast('请先完成测算'); return; }
        let d;
        switch (this._lastType) {
            case 'versine': d = Utils.versineToReportData(this._lastInput, this._lastResult); break;
            case 'corrugation': d = Utils.corrugationToReportData(this._lastInput, this._lastResult); break;
            case 'noise': d = Utils.noiseToReportData(this._lastInput, this._lastResult); break;
            case 'gap': d = Utils.gapToReportData(this._lastInput, this._lastResult); break;
            case 'accel': d = Utils.accelToReportData(this._lastInput, this._lastResult); break;
            default: Utils.showToast('无法生成报告'); return;
        }
        Report.showReport(d);
    },
    saveCurrentResult() {
        if (!this._lastInput || !this._lastResult || !this._lastType) { Utils.showToast('请先完成测算'); return; }
        let d;
        switch (this._lastType) {
            case 'versine': d = Utils.versineToReportData(this._lastInput, this._lastResult); break;
            case 'corrugation': d = Utils.corrugationToReportData(this._lastInput, this._lastResult); break;
            case 'noise': d = Utils.noiseToReportData(this._lastInput, this._lastResult); break;
            case 'gap': d = Utils.gapToReportData(this._lastInput, this._lastResult); break;
            case 'accel': d = Utils.accelToReportData(this._lastInput, this._lastResult); break;
            default: Utils.showToast('无法保存'); return;
        }
        const ok = Storage.save(d);
        if (ok) { Utils.showToast('✅ 结果已保存'); this.updateHistoryCount(); }
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());