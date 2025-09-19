const bundleAccess = {
    getBundleAccess() {
        return JSON.parse(localStorage.getItem('purchases') || '{}');
    },

    hasAccess(bundleI<strong>D.</strong>   {
        const purchases = this.getBundleAccess();
        return purchases[bundleId] === true;
    },

    setBundleAccess(bundleI<strong>D.</strong>   {
        const purchases = this.getBundleAccess();
        purchases[bundleId] = true;
        localStorage.setItem('purchases', JSON.stringify(purchases));
    },

    clearAccess() {
        localStorage.removeItem('purchases');
    }
};

export { bundleAccess };