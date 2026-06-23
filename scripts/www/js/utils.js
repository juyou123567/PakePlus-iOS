/* ===== 途测智宝 - 工具函数 ===== */

const Utils = {
    round(value, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },
    formatDateTime(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    },
    formatDate(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    },
    parseNumberLines(text) {
        if (!text || !text.trim()) return [];
        return text.trim().split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0).map(l => parseFloat(l)).filter(n => !isNaN(n));
    },
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) { modal.classList.add('active'); modal.style.display = 'flex'; }
    },
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) { modal.classList.remove('active'); modal.style.display = 'none'; }
    },
    showToast(message, duration = 2000) {
        const existing = document.querySelector('.app-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.textContent = message;
        toast.style.animation = `toast-in 0.3s ease, toast-out 0.3s ease ${duration / 1000 - 0.3}s forwards`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    },
    reportTimestamp() { return this.formatDateTime(); },
    versineToReportData(i, r) { return { type: '曲线正矢测算', typeKey: 'versine', timestamp: this.reportTimestamp(), input: { radius: i.radius, chord: i.chord, spacing: i.spacing, measured: i.measured }, result: { theoretical: r.theoretical, differences: r.differences, cumulativeDiffs: r.cumulativeDiffs, maxDiff: r.maxDiff, maxCumulativeDiff: r.maxCumulativeDiff, maxConsecutiveDiff: r.maxConsecutiveDiff, rangeMeasured: r.rangeMeasured, passed: r.passed, summary: r.summary } }; },
    corrugationToReportData(i, r) { return { type: '波磨量计算', typeKey: 'corrugation', timestamp: this.reportTimestamp(), input: { wavelength: i.wavelength, depth: i.depth, railType: i.railType }, result: { index: r.index, threshold: r.threshold, passed: r.passed, summary: r.summary } }; },
    noiseToReportData(i, r) { return { type: '噪音污染检测', typeKey: 'noise', timestamp: this.reportTimestamp(), input: { location: i.location, values: i.values, period: i.period }, result: { avg: r.avg, max: r.max, min: r.min, stdLimit: r.stdLimit, passed: r.passed, level: r.level, summary: r.summary } }; },
    gapToReportData(i, r) { return { type: '轨缝轨温锁温测算', typeKey: 'gap', timestamp: this.reportTimestamp(), input: { railType: i.railType, railLength: i.railLength, currentTemp: i.currentTemp, measuredGap: i.measuredGap, lockTemp: i.lockTemp }, result: { theoreticalGap: r.theoreticalGap, deviation: r.deviation, passed: r.passed, statusMessage: r.statusMessage, summary: r.summary } }; },
    accelToReportData(i, r) { return { type: '车体加速度测算', typeKey: 'accel', timestamp: this.reportTimestamp(), input: { speed: i.speed, ax: i.ax, ay: i.ay, az: i.az, freq: i.freq }, result: { resultant: r.resultant, comfort: r.comfort, freqValue: r.freqValue, passed: r.passed, summary: r.summary } }; }
};