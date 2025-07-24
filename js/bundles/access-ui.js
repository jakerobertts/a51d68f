import { bundleAccess } from './access.js';
import { BUNDLES } from '../../src/config/bundles.js';

export function createBundleButton(bundleId) {
    const bundle = BUNDLES[bundleId];
    return `
        <div class="bundle-access">
            <h3>${bundle.name}</h3>
            <p>Access ${bundle.sections.length} sections</p>
            <button onclick="testPayment('${bundleId}')" class="purchase-button">
                Purchase ($${(bundle.price / 100).toFixed(2)})
            </button>
        </div>
    `;
}

export function updateAccessUI() {
    document.querySelectorAll('[data-bundle]').forEach(element => {
        const bundleId = element.dataset.bundle;
        if (!bundleAccess.hasAccess(bundleId)) {
            element.classList.add('locked');
            element.innerHTML = createBundleButton(bundleId);
        }
    });
}