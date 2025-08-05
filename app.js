// Tax Deadline Tracker Application
class TaxDeadlineTracker {
    constructor() {
        this.currentTab = 'gst';
        this.currentSubTab = {
            'gst': 'monthly',
            'income-tax': 'itr',
            'roc': 'annual'
        };
        this.searchQuery = '';
        this.urgencyFilter = 'all';
        
        // Tax deadlines data
        this.data = {
            "gst_deadlines": {
                "monthly_returns": [
                    {"form": "GSTR-7", "description": "TDS Return", "due_date": "10th of following month", "current_due": "10th Aug 2025 (for July 2025)"},
                    {"form": "GSTR-8", "description": "TCS Return (E-commerce)", "due_date": "10th of following month", "current_due": "10th Aug 2025 (for July 2025)"},
                    {"form": "GSTR-1", "description": "Outward Supplies (Monthly)", "due_date": "11th of following month", "current_due": "11th Aug 2025 (for July 2025)", "note": "For turnover > ₹5 crore"},
                    {"form": "GSTR-5", "description": "Non-Resident Return", "due_date": "13th of following month", "current_due": "13th Aug 2025 (for July 2025)"},
                    {"form": "GSTR-6", "description": "Input Service Distributor", "due_date": "13th of following month", "current_due": "13th Aug 2025 (for July 2025)"},
                    {"form": "GSTR-3B", "description": "Summary Return (Monthly)", "due_date": "20th of following month", "current_due": "20th Aug 2025 (for July 2025)", "note": "For turnover > ₹5 crore"}
                ],
                "quarterly_returns": [
                    {"form": "GSTR-1", "description": "Outward Supplies (Quarterly)", "due_date": "13th of month after quarter", "current_due": "13th Oct 2025 (for July-Sep 2025)", "note": "For QRMP taxpayers"},
                    {"form": "GSTR-3B", "description": "Summary Return (Quarterly)", "due_date": "22nd/24th of month after quarter", "current_due": "22nd/24th Oct 2025 (for July-Sep 2025)", "note": "Category X/Y states"},
                    {"form": "CMP-08", "description": "Composition Scheme", "due_date": "18th of month after quarter", "current_due": "18th Oct 2025 (for July-Sep 2025)"}
                ],
                "annual_returns": [
                    {"form": "GSTR-4", "description": "Composition Annual Return", "due_date": "30th June", "current_due": "30th June 2025 (for FY 2024-25)"},
                    {"form": "GSTR-9", "description": "Annual Return", "due_date": "31st December", "current_due": "31st Dec 2025 (for FY 2024-25)"},
                    {"form": "GSTR-9C", "description": "Reconciliation Statement", "due_date": "31st December", "current_due": "31st Dec 2025 (for FY 2024-25)"}
                ]
            },
            "income_tax_deadlines": {
                "itr_filing": [
                    {"category": "Individual/HUF (Non-Audit)", "form": "ITR-1/2/3", "due_date": "15th September 2025", "note": "Extended from 31st July 2025"},
                    {"category": "Business (Audit Cases)", "form": "ITR-3/4/5/6/7", "due_date": "31st October 2025", "note": "Including audit report"},
                    {"category": "Transfer Pricing Cases", "form": "Various ITR", "due_date": "30th November 2025", "note": "International transactions"},
                    {"category": "Revised Return", "form": "Any ITR", "due_date": "31st December 2025", "note": "For corrections"},
                    {"category": "Belated Return", "form": "Any ITR", "due_date": "31st December 2025", "note": "With penalty"}
                ],
                "advance_tax": [
                    {"installment": "1st Installment", "due_date": "15th June 2025", "percentage": "15%"},
                    {"installment": "2nd Installment", "due_date": "15th September 2025", "percentage": "45%"},
                    {"installment": "3rd Installment", "due_date": "15th December 2025", "percentage": "75%"},
                    {"installment": "4th Installment", "due_date": "15th March 2026", "percentage": "100%"}
                ],
                "tds_compliance": [
                    {"form": "TDS Challan", "due_date": "7th of following month", "current_due": "7th Aug 2025 (for July 2025)"},
                    {"form": "TDS Return", "due_date": "Monthly/Quarterly", "note": "As per deductor category"}
                ]
            },
            "roc_deadlines": {
                "annual_filings": [
                    {"form": "AOC-4/AOC-4(XBRL)", "description": "Financial Statements", "due_date": "30 days from AGM", "note": "AGM by 30th Sep 2024"},
                    {"form": "MGT-7/MGT-7A", "description": "Annual Return", "due_date": "60 days from AGM", "note": "Different for small companies"},
                    {"form": "ADT-1", "description": "Auditor Appointment", "due_date": "15 days from appointment", "note": "After AGM"}
                ],
                "periodic_filings": [
                    {"form": "DIR-3 KYC", "description": "Director KYC", "due_date": "30th September 2024", "note": "Annual requirement"},
                    {"form": "MSME-1", "description": "MSME Outstanding Report", "due_date": "30th April & 31st October", "note": "Half-yearly"},
                    {"form": "PAS-6", "description": "Share Capital Reconciliation", "due_date": "30th May & 29th November", "note": "For unlisted public companies"},
                    {"form": "DPT-3", "description": "Return of Deposits", "due_date": "30th June 2024", "note": "Annual filing"},
                    {"form": "CSR-2", "description": "CSR Report", "due_date": "31st March 2025", "note": "For applicable companies"}
                ],
                "event_based": [
                    {"form": "MGT-14", "description": "Board Resolutions", "due_date": "30 days from BM", "note": "After board meeting"},
                    {"form": "SH-7", "description": "Dormancy Status", "due_date": "As applicable", "note": "For inactive companies"}
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.setCurrentDate();
        this.setupEventListeners();
        this.renderContent();
    }
    
    setCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-IN', options);
    }
    
    setupEventListeners() {
        // Main navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.textContent.toLowerCase().replace(/\s+/g, '-').replace('deadlines', '').trim();
                let mappedTab;
                if (tabName.includes('gst')) mappedTab = 'gst';
                else if (tabName.includes('income')) mappedTab = 'income-tax';
                else if (tabName.includes('roc')) mappedTab = 'roc';
                else if (tabName.includes('quick')) mappedTab = 'quick-reference';
                
                this.switchTab(mappedTab, e.target);
            });
        });
        
        // Sub-navigation tabs
        document.querySelectorAll('.sub-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const parentSection = e.target.closest('.tab-content');
                const parentId = parentSection.id.replace('-section', '');
                const subTabText = e.target.textContent.toLowerCase();
                
                let subTab;
                if (subTabText.includes('monthly')) subTab = 'monthly';
                else if (subTabText.includes('quarterly')) subTab = 'quarterly';
                else if (subTabText.includes('annual')) subTab = 'annual';
                else if (subTabText.includes('itr')) subTab = 'itr';
                else if (subTabText.includes('advance')) subTab = 'advance';
                else if (subTabText.includes('tds')) subTab = 'tds';
                else if (subTabText.includes('periodic')) subTab = 'periodic';
                else if (subTabText.includes('event')) subTab = 'event';
                
                this.switchSubTab(parentId, subTab, e.target);
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderContent();
        });
        
        // Search button
        document.querySelector('.search-btn').addEventListener('click', () => {
            this.performSearch();
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const urgency = e.target.textContent.toLowerCase().replace(/\s+/g, '-');
                let mappedUrgency;
                if (urgency.includes('all')) mappedUrgency = 'all';
                else if (urgency.includes('overdue')) mappedUrgency = 'overdue';
                else if (urgency.includes('due-soon')) mappedUrgency = 'urgent';
                else if (urgency.includes('upcoming')) mappedUrgency = 'upcoming';
                
                this.filterByUrgency(mappedUrgency, e.target);
            });
        });
        
        // Modal close functionality
        document.getElementById('card-modal').addEventListener('click', (e) => {
            if (e.target.id === 'card-modal') {
                this.closeModal();
            }
        });
        
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
        });
    }
    
    switchTab(tab, targetElement) {
        this.currentTab = tab;
        
        // Update active nav tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        if (targetElement) targetElement.classList.add('active');
        
        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-section`).classList.add('active');
        
        this.renderContent();
    }
    
    switchSubTab(parentTab, subTab, targetElement) {
        this.currentSubTab[parentTab] = subTab;
        
        // Update active sub tab
        const parentSection = document.getElementById(`${parentTab}-section`);
        parentSection.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
        if (targetElement) targetElement.classList.add('active');
        
        // Show/hide sub content
        parentSection.querySelectorAll('.sub-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${parentTab}-${subTab}`).classList.add('active');
        
        this.renderContent();
    }
    
    filterByUrgency(urgency, targetElement) {
        this.urgencyFilter = urgency;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (targetElement) targetElement.classList.add('active');
        
        this.renderContent();
    }
    
    renderContent() {
        switch(this.currentTab) {
            case 'gst':
                this.renderGSTContent();
                break;
            case 'income-tax':
                this.renderIncomeTaxContent();
                break;
            case 'roc':
                this.renderROCContent();
                break;
            case 'quick-reference':
                this.renderQuickReference();
                break;
        }
    }
    
    renderGSTContent() {
        const subTab = this.currentSubTab['gst'];
        const gridId = `gst-${subTab}-grid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) return;
        
        let data;
        switch(subTab) {
            case 'monthly':
                data = this.data.gst_deadlines.monthly_returns;
                break;
            case 'quarterly':
                data = this.data.gst_deadlines.quarterly_returns;
                break;
            case 'annual':
                data = this.data.gst_deadlines.annual_returns;
                break;
        }
        
        const filteredData = this.filterData(data, 'gst');
        grid.innerHTML = this.generateCards(filteredData, 'gst');
    }
    
    renderIncomeTaxContent() {
        const subTab = this.currentSubTab['income-tax'];
        const gridId = `income-tax-${subTab}-grid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) return;
        
        let data;
        switch(subTab) {
            case 'itr':
                data = this.data.income_tax_deadlines.itr_filing;
                break;
            case 'advance':
                data = this.data.income_tax_deadlines.advance_tax;
                break;
            case 'tds':
                data = this.data.income_tax_deadlines.tds_compliance;
                break;
        }
        
        const filteredData = this.filterData(data, 'income-tax');
        grid.innerHTML = this.generateCards(filteredData, 'income-tax');
    }
    
    renderROCContent() {
        const subTab = this.currentSubTab['roc'];
        const gridId = `roc-${subTab}-grid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) return;
        
        let data;
        switch(subTab) {
            case 'annual':
                data = this.data.roc_deadlines.annual_filings;
                break;
            case 'periodic':
                data = this.data.roc_deadlines.periodic_filings;
                break;
            case 'event':
                data = this.data.roc_deadlines.event_based;
                break;
        }
        
        const filteredData = this.filterData(data, 'roc');
        grid.innerHTML = this.generateCards(filteredData, 'roc');
    }
    
    renderQuickReference() {
        const grid = document.getElementById('quick-reference-grid');
        if (!grid) return;
        
        const allDeadlines = this.getAllUpcomingDeadlines();
        const filteredData = this.filterDataByUrgency(allDeadlines);
        grid.innerHTML = this.generateCards(filteredData, 'quick-reference');
    }
    
    filterData(data, category) {
        if (!this.searchQuery) return data;
        
        return data.filter(item => {
            const searchFields = [
                item.form || '',
                item.description || '',
                item.category || '',
                item.installment || '',
                item.note || '',
                item.due_date || '',
                item.current_due || ''
            ].join(' ').toLowerCase();
            
            return searchFields.includes(this.searchQuery);
        });
    }
    
    filterDataByUrgency(data) {
        if (this.urgencyFilter === 'all') return data;
        
        return data.filter(item => {
            const urgency = this.calculateUrgency(item);
            return urgency === this.urgencyFilter;
        });
    }
    
    getAllUpcomingDeadlines() {
        const allDeadlines = [];
        
        // GST deadlines
        ['monthly_returns', 'quarterly_returns', 'annual_returns'].forEach(type => {
            this.data.gst_deadlines[type].forEach(item => {
                allDeadlines.push({...item, category: 'GST', type: type.replace('_', ' ')});
            });
        });
        
        // Income Tax deadlines
        ['itr_filing', 'advance_tax', 'tds_compliance'].forEach(type => {
            this.data.income_tax_deadlines[type].forEach(item => {
                allDeadlines.push({...item, category: 'Income Tax', type: type.replace('_', ' ')});
            });
        });
        
        // ROC deadlines
        ['annual_filings', 'periodic_filings', 'event_based'].forEach(type => {
            this.data.roc_deadlines[type].forEach(item => {
                allDeadlines.push({...item, category: 'ROC', type: type.replace('_', ' ')});
            });
        });
        
        return allDeadlines.sort((a, b) => {
            const dateA = this.parseDate(a.due_date || a.current_due || '');
            const dateB = this.parseDate(b.due_date || b.current_due || '');
            return dateA - dateB;
        });
    }
    
    generateCards(data, category) {
        if (!data || data.length === 0) {
            return `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
        }
        
        return data.map((item, index) => this.generateCard(item, category, index)).join('');
    }
    
    generateCard(item, category, index) {
        const urgency = this.calculateUrgency(item);
        const daysRemaining = this.calculateDaysRemaining(item);
        const urgencyBadge = this.getUrgencyBadge(urgency);
        
        const formDisplay = item.form || item.installment || item.category || 'N/A';
        const description = item.description || item.category || item.installment || '';
        const dueDate = item.due_date || 'N/A';
        const currentDue = item.current_due || '';
        const note = item.note || '';
        const percentage = item.percentage || '';
        
        const cardId = `card-${category}-${index}`;
        
        return `
            <div class="deadline-card ${urgency}" id="${cardId}" data-item='${JSON.stringify(item)}' data-category="${category}">
                <div class="card-header">
                    <span class="form-number">${formDisplay}</span>
                    ${urgencyBadge}
                </div>
                <div class="card-description">${description}</div>
                <div class="due-date">Due: ${dueDate}</div>
                ${currentDue ? `<div class="current-due">${currentDue}</div>` : ''}
                ${percentage ? `<div class="current-due">Amount: ${percentage}</div>` : ''}
                ${note ? `<div class="card-note">${note}</div>` : ''}
                <div class="days-remaining">${daysRemaining}</div>
            </div>
        `;
    }
    
    calculateUrgency(item) {
        const days = this.calculateDaysRemainingNumber(item);
        
        if (days < 0) return 'overdue';
        if (days <= 7) return 'urgent';
        return 'upcoming';
    }
    
    calculateDaysRemaining(item) {
        const days = this.calculateDaysRemainingNumber(item);
        
        if (days < 0) {
            return `Overdue by ${Math.abs(days)} days`;
        } else if (days === 0) {
            return 'Due today';
        } else if (days === 1) {
            return 'Due tomorrow';
        } else {
            return `${days} days remaining`;
        }
    }
    
    calculateDaysRemainingNumber(item) {
        const targetDate = this.parseDate(item.current_due || item.due_date || '');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    parseDate(dateString) {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Handle specific date formats
        if (dateString.includes('Aug 2025')) {
            const day = parseInt(dateString.match(/\d+/)[0]);
            return new Date(2025, 7, day); // August is month 7
        }
        if (dateString.includes('Oct 2025')) {
            const day = parseInt(dateString.match(/\d+/)[0]);
            return new Date(2025, 9, day); // October is month 9
        }
        if (dateString.includes('June 2025')) {
            return new Date(2025, 5, 30); // June 30, 2025
        }
        if (dateString.includes('Dec 2025')) {
            return new Date(2025, 11, 31); // December 31, 2025
        }
        if (dateString.includes('September 2025')) {
            return new Date(2025, 8, 15); // September 15, 2025
        }
        if (dateString.includes('October 2025')) {
            return new Date(2025, 9, 31); // October 31, 2025
        }
        if (dateString.includes('November 2025')) {
            return new Date(2025, 10, 30); // November 30, 2025
        }
        if (dateString.includes('December 2025')) {
            return new Date(2025, 11, 31); // December 31, 2025
        }
        if (dateString.includes('March 2026')) {
            return new Date(2026, 2, 15); // March 15, 2026
        }
        if (dateString.includes('March 2025')) {
            return new Date(2025, 2, 31); // March 31, 2025
        }
        if (dateString.includes('June 2024')) {
            return new Date(2024, 5, 30); // June 30, 2024
        }
        if (dateString.includes('September 2024')) {
            return new Date(2024, 8, 30); // September 30, 2024
        }
        
        // Default to a future date to avoid showing as overdue
        return new Date(currentYear + 1, 0, 1);
    }
    
    getUrgencyBadge(urgency) {
        const labels = {
            'overdue': 'Overdue',
            'urgent': 'Due Soon',
            'upcoming': 'Upcoming'
        };
        
        return `<span class="urgency-badge ${urgency}">${labels[urgency]}</span>`;
    }
    
    showCardDetails(item, category) {
        const modal = document.getElementById('card-modal');
        const modalBody = document.getElementById('modal-body');
        
        const formDisplay = item.form || item.installment || item.category || 'N/A';
        const description = item.description || item.category || item.installment || '';
        const dueDate = item.due_date || 'N/A';
        const currentDue = item.current_due || '';
        const note = item.note || '';
        const percentage = item.percentage || '';
        const urgency = this.calculateUrgency(item);
        const daysRemaining = this.calculateDaysRemaining(item);
        
        modalBody.innerHTML = `
            <h3 class="category-${category.toLowerCase()}">${formDisplay}</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            ${currentDue ? `<p><strong>Current Due:</strong> ${currentDue}</p>` : ''}
            ${percentage ? `<p><strong>Amount:</strong> ${percentage}</p>` : ''}
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
            <p><strong>Status:</strong> <span class="urgency-badge ${urgency}">${this.getUrgencyBadge(urgency).match(/>([^<]+)</)[1]}</span></p>
            <p><strong>Time Remaining:</strong> ${daysRemaining}</p>
            ${category ? `<p><strong>Category:</strong> ${category.toUpperCase()}</p>` : ''}
        `;
        
        modal.classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('card-modal').classList.add('hidden');
    }
    
    performSearch() {
        const searchInput = document.getElementById('search-input');
        this.searchQuery = searchInput.value.toLowerCase();
        this.renderContent();
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TaxDeadlineTracker();
    
    // Add click event listeners to deadline cards after they're rendered
    document.addEventListener('click', (e) => {
        if (e.target.closest('.deadline-card')) {
            const card = e.target.closest('.deadline-card');
            const item = JSON.parse(card.getAttribute('data-item'));
            const category = card.getAttribute('data-category');
            app.showCardDetails(item, category);
        }
    });
});