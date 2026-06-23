const Bluetooth = {
    device: null, isConnected: false, isScanning: false,
    init() { this.updateStatusUI(); },
    updateStatusUI() {
        const s = document.getElementById('bluetoothStatus');
        const t = s.querySelector('.bt-text');
        s.classList.remove('connected', 'scanning');
        if (this.isConnected) { s.classList.add('connected'); t.textContent = '已连接设备'; }
        else if (this.isScanning) { s.classList.add('scanning'); t.textContent = '搜索中...'; }
        else { t.textContent = '蓝牙未连接'; }
    },
    scanDevices() {
        const dl = document.getElementById('btDeviceList');
        this.isScanning = true; this.updateStatusUI();
        dl.innerHTML = '<p style="text-align:center;color:#888;">🔍 正在搜索设备...</p>';
        setTimeout(() => {
            this.isScanning = false; this.isConnected = true; this.updateStatusUI();
            dl.innerHTML = `
<div class="bt-device-item" onclick="Bluetooth._selectFakeDevice('pro')" style="background:#e8f8f0;border:1.5px solid #27ae60;">
<div><div class="device-name">🛤️ 轨距智测先锋-Pro</div><div class="device-id">型号: GJZC-PRO | 状态: 在线</div></div><span style="color:#27ae60;font-weight:600;">连接</span></div>
<div class="bt-device-item" onclick="Bluetooth._selectFakeDevice('lite')" style="background:#fff;">
<div><div class="device-name">🔧 轨距智测先锋-Lite</div><div class="device-id">型号: GJZC-LITE | 状态: 在线</div></div><span style="color:#2980b9;font-weight:600;">连接</span></div>
<div class="bt-device-item" onclick="Bluetooth._selectFakeDevice('mini')" style="background:#fff;">
<div><div class="device-name">📱 轨距智测先锋-Mini</div><div class="device-id">型号: GJZC-MINI | 信号: 较弱</div></div><span style="color:#95a5a6;font-weight:600;">连接</span></div>
`;
            Utils.showToast('✅ 发现 3 台设备');
        }, 1200);
    },
    _selectFakeDevice(type) {
        const names = { pro: '轨距智测先锋-Pro', lite: '轨距智测先锋-Lite', mini: '轨距智测先锋-Mini' };
        const dl = document.getElementById('btDeviceList');
        dl.innerHTML = `<div class="bt-device-item" style="background:#e8f8f0;border:1.5px solid #27ae60;"><div><div class="device-name">${names[type]}</div><div class="device-id">已连接 · 模拟设备</div></div><span style="color:#27ae60;font-weight:600;">✓ 已连接</span></div>`;
        this.isConnected = true; this.updateStatusUI();
        Utils.showToast('✅ 已成功连接设备！');
        const d = this.generateSimulatedData(); this.fillSimulatedData(d);
        setTimeout(() => { Utils.hideModal('modalBluetooth'); }, 800);
    },
    simulateData() {
        this.isConnected = true; this.updateStatusUI();
        Utils.showToast('✅ 已进入模拟模式');
        const c = document.getElementById('btDeviceList');
        if (c) { c.innerHTML = '<div class="bt-device-item" style="background:#e8f8f0;border:1.5px solid #27ae60;"><div><div class="device-name">轨距智测先锋 (模拟)</div><div class="device-id">模式: 演示数据</div></div><span style="color:#27ae60;font-weight:600;">✓ 已连接</span></div>'; }
        const d = this.generateSimulatedData(); this.fillSimulatedData(d);
        Utils.hideModal('modalBluetooth');
    },
    generateSimulatedData() {
        return {
            versine: { radius: 800, chord: 20, spacing: 5, measured: [12.5, 13.0, 12.8, 13.2, 12.6] },
            corrugation: { wavelength: 120, depth: 0.55, railType: '60' },
            noise: { location: 'K125+800上行', values: [68.5, 72.3, 65.8, 70.1, 69.2], period: 'day' },
            gap: { railType: '60', railLength: 25, currentTemp: 28.5, measuredGap: 8.2, lockTemp: 25 },
            accel: { speed: 80, ax: 0.35, ay: 0.48, az: 0.22, freq: 2.5 }
        };
    },
    fillSimulatedData(d) {
        document.getElementById('v-radius').value = d.versine.radius;
        document.getElementById('v-chord').value = d.versine.chord;
        document.getElementById('v-spacing').value = d.versine.spacing;
        document.getElementById('v-measured').value = d.versine.measured.join('\n');
        document.getElementById('c-wavelength').value = d.corrugation.wavelength;
        document.getElementById('c-depth').value = d.corrugation.depth;
        document.getElementById('c-rail-type').value = d.corrugation.railType;
        document.getElementById('n-location').value = d.noise.location;
        document.getElementById('n-values').value = d.noise.values.join('\n');
        document.getElementById('n-period').value = d.noise.period;
        document.getElementById('g-rail-type').value = d.gap.railType;
        document.getElementById('g-rail-length').value = d.gap.railLength;
        document.getElementById('g-temp').value = d.gap.currentTemp;
        document.getElementById('g-gap').value = d.gap.measuredGap;
        document.getElementById('g-lock-temp').value = d.gap.lockTemp;
        document.getElementById('a-speed').value = d.accel.speed;
        document.getElementById('a-x').value = d.accel.ax;
        document.getElementById('a-y').value = d.accel.ay;
        document.getElementById('a-z').value = d.accel.az;
        document.getElementById('a-freq').value = d.accel.freq;
        Utils.showToast('📝 模拟数据已填入各模块，可前往对应功能进行测算');
    }
};