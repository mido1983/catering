$(document).ready(function() {
    // Load supplements from JSON
    $.getJSON('data/supplements.json', function(data) {
        displaySupplements(data.supplements);
    });

    function displaySupplements(supplements) {
        const container = $('.supplements-container');
        
        supplements.forEach(supplement => {
            const benefitsList = supplement.benefits.map(benefit => 
                `<li>${benefit}</li>`
            ).join('');

            const supplementCard = `
                <div class="col-md-6 col-lg-4">
                    <div class="supplement-card">
                        <div class="card-header">
                            <h3 class="mb-0">${supplement.name}</h3>
                        </div>
                        <div class="card-body">
                            <p>${supplement.description}</p>
                            
                            <h5>Benefits:</h5>
                            <ul class="benefits-list mb-3">
                                ${benefitsList}
                            </ul>
                            
                            <h5>Recommended Dose:</h5>
                            <p>${supplement.recommendedDose}</p>
                            
                            <h5>Warnings:</h5>
                            <p class="text-danger mb-3">${supplement.warnings}</p>
                            
                            <a href="${supplement.source}" 
                               target="_blank" 
                               class="source-link">
                                <i class="fas fa-external-link-alt me-1"></i>
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.append(supplementCard);
        });
    }
}); 