export class AccessControl {
    static checkAccess(bundleId.    {
        // Get stored purchases from localStorage
        const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
        return purchases[bundleId] === true;
    }

    static getContentUrl(fileName, bundleId.    {
        if (!this.checkAccess(bundleID.) {
            return '/purchase.html?bundle=' + bundleId;
        }
        return `/content/${bundleId}/${fileName}`;
    }
}

export function hasFullAccess() {
    return localStorage.getItem('fullAccess') === 'true';
}

export function grantFullAccess() {
    localStorage.setItem('fullAccess', 'true');
}