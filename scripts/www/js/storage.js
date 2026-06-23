const Storage = {
    STORAGE_KEY: 'tucezhibao_records', MAX_RECORDS: 100,
    getAll() {
        try { const r = localStorage.getItem(this.STORAGE_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; }
    },
    save(rec) {
        const recs = this.getAll(); rec.id = Utils.generateId(); recs.unshift(rec);
        if (recs.length > this.MAX_RECORDS) recs.length = this.MAX_RECORDS;
        try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recs)); return true; }
        catch (e) { Utils.showToast('存储空间不足，请清理旧记录'); return false; }
    },
    delete(id) {
        let recs = this.getAll(); recs = recs.filter(r => r.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recs));
    },
    clearAll() { localStorage.removeItem(this.STORAGE_KEY); },
    count() { return this.getAll().length; },
    exportAll() { return JSON.stringify(this.getAll(), null, 2); }
};