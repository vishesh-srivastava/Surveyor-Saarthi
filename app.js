// Insurance Survey Report Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('submitForm');
    const clearBtn = document.getElementById('clearForm');
    const printBtn = document.getElementById('printForm');
    const newReportBtn = document.getElementById('newReport');
    const successMessage = document.getElementById('successMessage');
    
    // Financial calculation fields
    const estimatedRepairCost = document.getElementById('estimatedRepairCost');
    const replacementCost = document.getElementById('replacementCost');
    const depreciation = document.getElementById('depreciation');
    const netClaimAmount = document.getElementById('netClaimAmount');
    
    // Set default dates
    setDefaultDates();
    
    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', handleClearForm);
    printBtn.addEventListener('click', handlePrintForm);
    newReportBtn.addEventListener('click', handleNewReport);
    
    // Auto-calculation listeners
    estimatedRepairCost.addEventListener('input', calculateNetClaim);
    replacementCost.addEventListener('input', calculateNetClaim);
    depreciation.addEventListener('input', calculateNetClaim);
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Functions
    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        
        // Set default dates for survey and report dates
        const dateOfSurvey = document.getElementById('dateOfSurvey');
        const surveyDate = document.getElementById('surveyDate');
        const dateOfReport = document.getElementById('dateOfReport');
        
        if (!dateOfSurvey.value) dateOfSurvey.value = today;
        if (!surveyDate.value) surveyDate.value = today;
        if (!dateOfReport.value) dateOfReport.value = today;
    }
    
    function calculateNetClaim() {
        const repair = parseFloat(estimatedRepairCost.value) || 0;
        const replacement = parseFloat(replacementCost.value) || 0;
        const dep = parseFloat(depreciation.value) || 0;
        
        // Calculate net claim: use the lower of repair or replacement cost, minus depreciation
        let baseAmount = 0;
        if (repair > 0 && replacement > 0) {
            baseAmount = Math.min(repair, replacement);
        } else if (repair > 0) {
            baseAmount = repair;
        } else if (replacement > 0) {
            baseAmount = replacement;
        }
        
        const netAmount = Math.max(0, baseAmount - dep);
        netClaimAmount.value = netAmount.toFixed(2);
        
        // Add visual indicator for calculated field
        if (netAmount > 0) {
            netClaimAmount.classList.add('calculated-field');
        } else {
            netClaimAmount.classList.remove('calculated-field');
        }
    }
    
    function validateField(event) {
        const field = event.target;
        const fieldContainer = field.closest('.form-group');
        
        // Remove existing error styling
        field.classList.remove('error');
        let existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'This field is required.');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address.');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid phone number.');
                return false;
            }
        }
        
        // Date validation - ensure dates are not in the future (except for future survey dates)
        if (field.type === 'date' && field.value && field.id !== 'surveyDate' && field.id !== 'dateOfSurvey' && field.id !== 'dateOfReport') {
            const inputDate = new Date(field.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (inputDate > today && field.id === 'dateOfIncident') {
                showFieldError(field, 'Incident date cannot be in the future.');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const fieldContainer = field.closest('.form-group');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        fieldContainer.appendChild(errorDiv);
    }
    
    function clearFieldError(event) {
        const field = event.target;
        field.classList.remove('error');
        const fieldContainer = field.closest('.form-group');
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Clear all previous errors
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        // Additional business logic validations
        const dateOfIncident = document.getElementById('dateOfIncident').value;
        const dateOfSurvey = document.getElementById('dateOfSurvey').value;
        
        if (dateOfIncident && dateOfSurvey) {
            const incidentDate = new Date(dateOfIncident);
            const surveyDate = new Date(dateOfSurvey);
            
            if (surveyDate < incidentDate) {
                showFieldError(document.getElementById('dateOfSurvey'), 'Survey date cannot be before incident date.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('btn--loading');
        submitBtn.textContent = 'Submitting...';
        
        // Simulate form submission
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Reset submit button
            submitBtn.classList.remove('btn--loading');
            submitBtn.textContent = 'Submit Report';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }
    
    function handleClearForm() {
        if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
            form.reset();
            
            // Clear calculated fields
            netClaimAmount.value = '';
            netClaimAmount.classList.remove('calculated-field');
            
            // Clear all errors
            form.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });
            form.querySelectorAll('.error-message').forEach(error => {
                error.remove();
            });
            
            // Reset section completion indicators
            form.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('completed', 'incomplete');
            });
            
            // Reset default dates
            setDefaultDates();
            
            // Focus on first field
            const firstField = form.querySelector('.form-control');
            if (firstField) {
                firstField.focus();
            }
        }
    }
    
    function handlePrintForm() {
        // Store original values for readonly fields
        const readonlyFields = form.querySelectorAll('[readonly]');
        const originalBorders = [];
        
        readonlyFields.forEach((field, index) => {
            originalBorders[index] = field.style.border;
        });
        
        // Add print-friendly class
        document.body.classList.add('printing');
        
        // Print the form
        window.print();
        
        // Clean up
        document.body.classList.remove('printing');
        
        // Restore original styling
        readonlyFields.forEach((field, index) => {
            field.style.border = originalBorders[index];
        });
    }
    
    function handleNewReport() {
        successMessage.classList.add('hidden');
        form.style.display = 'block';
        handleClearForm();
    }
    
    // Section completion tracking
    function updateSectionCompletion() {
        const sections = form.querySelectorAll('.form-section');
        
        sections.forEach(section => {
            const requiredFieldsInSection = section.querySelectorAll('[required]');
            let completedFields = 0;
            
            requiredFieldsInSection.forEach(field => {
                if (field.type === 'checkbox') {
                    if (field.checked) completedFields++;
                } else if (field.value.trim()) {
                    completedFields++;
                }
            });
            
            // Update section styling based on completion
            if (completedFields === requiredFieldsInSection.length && requiredFieldsInSection.length > 0) {
                section.classList.add('completed');
                section.classList.remove('incomplete');
            } else if (completedFields > 0) {
                section.classList.add('incomplete');
                section.classList.remove('completed');
            } else {
                section.classList.remove('completed', 'incomplete');
            }
        });
    }
    
    // Monitor form changes for section completion
    form.addEventListener('input', updateSectionCompletion);
    form.addEventListener('change', updateSectionCompletion);
    
    // Initial section completion check
    updateSectionCompletion();
    
    // Auto-save functionality (optional - stores in memory only)
    let autoSaveData = {};
    
    function autoSave() {
        const formData = new FormData(form);
        autoSaveData = {};
        for (let [key, value] of formData.entries()) {
            autoSaveData[key] = value;
        }
    }
    
    function loadAutoSave() {
        for (let [key, value] of Object.entries(autoSaveData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value === 'on';
                } else {
                    field.value = value;
                }
            }
        }
        calculateNetClaim();
        updateSectionCompletion();
    }
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            autoSave();
        }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', function(event) {
        // Check if form has unsaved changes
        const formData = new FormData(form);
        let hasData = false;
        for (let [key, value] of formData.entries()) {
            if (value && value.trim()) {
                hasData = true;
                break;
            }
        }
        
        if (hasData && form.style.display !== 'none') {
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+S or Cmd+S to auto-save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            autoSave();
            
            // Show brief save indicator
            const saveIndicator = document.createElement('div');
            saveIndicator.textContent = 'Form saved';
            saveIndicator.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--color-success);color:white;padding:8px 16px;border-radius:4px;z-index:1000;';
            document.body.appendChild(saveIndicator);
            setTimeout(() => document.body.removeChild(saveIndicator), 2000);
        }
        
        // Ctrl+P or Cmd+P to print
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            handlePrintForm();
        }
    });
    
    console.log('Insurance Survey Report Form initialized successfully');
});