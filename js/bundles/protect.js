import { bundleAccess } from './access.js';
import { BUNDLES } from '../../src/config/bundles.js';

function protectContent() {
    document.querySelectorAll('[data-bundle]').forEach(element => {
        const bundleId = element.dataset.bundle;
        
        if (!bundleAccess.hasAccess(bundleId)) {
            const bundle = BUNDLES[bundleId];
            element.innerHTML = `
                <div class="locked-content">
                    <h3>${bundle.name}</h3>
                    <p>This content requires the ${bundle.name} bundle</p>
                    <p>Includes ${bundle.sections.length} sections</p>
                    <button onclick="testPayment('${bundleId}')">
                        Purchase Access ($${(bundle.price / 100).toFixed(2)})
                    </button>
                </div>
            `;
        }
    });
}

export { protectContent };