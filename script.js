function calculatePrice() {
    var users = parseInt(document.getElementById('totalUsers').value);
    var selectedPlans = Array.from(document.getElementById('plan').selectedOptions).map(option => option.value);
    var selectedTerms = Array.from(document.getElementById('term').selectedOptions).map(option => parseInt(option.value));

    var pricePerYear = {
        'basic': 149.99,
        'dispatch': 249.99,
        'plus': 449.99
    };

    var resultDiv = document.getElementById('result-summary');
    resultDiv.innerHTML = ''; // Clear previous results

    var bestDealDiscount = 0;
    var bestDealTerm = 0; // Keep track of the term for the best deal
    var bestDealCell = null;

    var table = document.createElement('table');
    table.className = 'summary-table';
    table.style.width = '100%';
    table.setAttribute('border', '1');

    var thead = table.createTHead();
    var headerRow = thead.insertRow();
    headerRow.appendChild(document.createElement('th')); // Empty header for 'Plan'

    selectedTerms.forEach(term => {
        var th = document.createElement('th');
        th.innerText = `${term} Year Term`;
        headerRow.appendChild(th);
    });

    var tbody = table.createTBody();

    selectedPlans.forEach(plan => {
        var row = tbody.insertRow();
        var planCell = row.insertCell();
        planCell.innerText = plan.charAt(0).toUpperCase() + plan.slice(1);

        selectedTerms.forEach(term => {
            var cell = row.insertCell();
            var userDiscount = users >= 50 ? 0.2 : users >= 25 ? 0.15 : users >= 10 ? 0.1 : 0;
            var termDiscount = term === 3 ? 0.1 : term === 5 ? (plan === 'basic' ? 0.1 : (plan === 'dispatch' ? 0.25 : (plan === 'plus' ? 0.35 : 0))) : 0;

            var originalPrice = pricePerYear[plan] * users * term;
            var userDiscountAmount = originalPrice * userDiscount;
            var termDiscountAmount = (originalPrice - userDiscountAmount) * termDiscount;
            var finalPrice = originalPrice - userDiscountAmount - termDiscountAmount;

            var totalDiscountPercentage = (userDiscount + termDiscount) * 100;
            var totalDiscountValue = userDiscountAmount + termDiscountAmount;

            if (totalDiscountPercentage > bestDealDiscount || (totalDiscountPercentage === bestDealDiscount && term > bestDealTerm)) {
                bestDealDiscount = totalDiscountPercentage;
                bestDealTerm = term;
                if (bestDealCell) {
                    var existingBestDealTag = bestDealCell.querySelector('.best-deal-tag');
                    if (existingBestDealTag) {
                        bestDealCell.removeChild(existingBestDealTag);
                    }
                }
                bestDealCell = cell;
            }

            var detailsDiv = document.createElement('div');
            detailsDiv.className = 'price-details';
            detailsDiv.style.display = 'none';
            detailsDiv.innerHTML = `<strong>Full Price: $${originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong><br>
                                    User Disc: ${userDiscount * 100}% ($${userDiscountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})})<br>
                                    Term Disc: ${termDiscount * 100}% ($${termDiscountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})})<hr>
                                    Total Disc: ${totalDiscountPercentage.toFixed(2)}% ($${totalDiscountValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})})`;
            cell.appendChild(detailsDiv);

            var pricePerUserDiv = document.createElement('div');
            pricePerUserDiv.className = 'price-per-user';
            pricePerUserDiv.style.display = 'none';
            pricePerUserDiv.innerHTML = `Price/user/year: $${(finalPrice / (users * term)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            cell.appendChild(pricePerUserDiv);

            var finalPriceDiv = document.createElement('div');
            finalPriceDiv.innerHTML = `<strong>Final Price: $${finalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
            cell.appendChild(finalPriceDiv);

            var discountsDiv = document.createElement('div');
            discountsDiv.className = 'discounts';

            if (userDiscount > 0) {
                var userTag = createDiscountTag('Bulk User Discount', userDiscount * 100, '#d85927');
                discountsDiv.appendChild(userTag);
            }

            if (termDiscount > 0) {
                var termTag = createDiscountTag('Multi-Year Discount', termDiscount * 100, '#4F97E9');
                discountsDiv.appendChild(termTag);
            }

            cell.appendChild(discountsDiv);
        });
    });

    resultDiv.appendChild(table);
    table.style.display = 'table';

    if (bestDealCell) {
        var bestDealTag = createDiscountTag('Best Deal', bestDealDiscount, '#83BC5F');
        bestDealTag.className += ' best-deal-tag';
        bestDealCell.appendChild(bestDealTag);
    }

    var detailsToggle = document.getElementById('detailsToggle');
    detailsToggle.checked = false;
    updateDetailsVisibility(false);
}

function createDiscountTag(text, percentage, color) {
    var tag = document.createElement('span');
    tag.className = 'discount-tag';
    tag.textContent = `${text} ${percentage.toFixed(2)}%`;
    tag.style.backgroundColor = color;
    return tag;
}

function updateDetailsVisibility(showDetails) {
    var detailElements = document.querySelectorAll('.price-details, .price-per-user');
    var tagElements = document.querySelectorAll('.discounts, .best-deal-tag');

    detailElements.forEach(element => {
        element.style.display = showDetails ? 'block' : 'none';
    });

    tagElements.forEach(tag => {
        tag.style.display = showDetails ? 'none' : 'block';
    });
}

document.getElementById('detailsToggle').addEventListener('change', function() {
    updateDetailsVisibility(this.checked);
});

window.onload = function() {
    var detailsToggle = document.getElementById('detailsToggle');
    detailsToggle.checked = false;
    updateDetailsVisibility(detailsToggle.checked);
}

document.getElementById('calculateButton').addEventListener('click', calculatePrice);
