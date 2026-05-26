// Email Templates for Daily Notifications

export const InvestorDailyEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .deal-card { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
    .btn { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ðŸ“ˆ Daily Investor Digest</h1>
      <p>{{date}}</p>
    </div>

    <div class="section">
      <h2>ðŸ“Š Your Portfolio Today</h2>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{portfolioValue}}</div>
          <div>Portfolio Value</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: {{returnColor}}">{{returnPercentage}}</div>
          <div>24h Return</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{activeBids}}</div>
          <div>Active Bids</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>ðŸ†• New Investment Opportunities</h2>
      {{#newDeals}}
      <div class="deal-card">
        <h3>{{propertyAddress}}</h3>
        <p><strong>Type:</strong> {{propertyType}} | <strong>Value:</strong> {{propertyValue}}</p>
        <p><strong>LVR:</strong> {{lvr}}% | <strong>Expected Return:</strong> {{expectedReturn}}%</p>
        <p><strong>Auction Date:</strong> {{auctionDate}}</p>
        <a href="{{dealLink}}" class="btn">View Deal Details</a>
      </div>
      {{/newDeals}}
    </div>

    <div class="section">
      <h2>âš ï¸ Action Required</h2>
      {{#actionItems}}
      <div class="deal-card">
        <strong>{{title}}</strong>
        <p>{{description}}</p>
        <a href="{{actionLink}}" class="btn">Take Action</a>
      </div>
      {{/actionItems}}
    </div>

    <div class="section">
      <h2>ðŸ“ˆ Market Insights</h2>
      <p>{{marketInsights}}</p>
    </div>

    <div class="footer">
      <p>Â© 2024 Grow MIP. All rights reserved.</p>
      <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{preferencesLink}}">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

export const LenderDailyEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
    .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .loan-card { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #11998e; }
    .risk-indicator { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .risk-low { background: #d4edda; color: #155724; }
    .risk-medium { background: #fff3cd; color: #856404; }
    .risk-high { background: #f8d7da; color: #721c24; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #11998e; }
    .btn { background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ðŸ¦ Daily Lender Report</h1>
      <p>{{date}}</p>
    </div>

    <div class="section">
      <h2>ðŸ“Š Loan Portfolio Summary</h2>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{totalLoanBook}}</div>
          <div>Total Loan Book</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{activeLoans}}</div>
          <div>Active Loans</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{avgLVR}}%</div>
          <div>Avg LVR</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>ðŸ†• New Loan Applications</h2>
      {{#newApplications}}
      <div class="loan-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{borrowerName}}</h3>
          <span class="risk-indicator risk-{{riskLevel}}">{{riskLevel}} Risk</span>
        </div>
        <p><strong>Loan Amount:</strong> {{loanAmount}} | <strong>Property Value:</strong> {{propertyValue}}</p>
        <p><strong>LVR:</strong> {{lvr}}% | <strong>Term:</strong> {{loanTerm}} months</p>
        <p><strong>Purpose:</strong> {{loanPurpose}}</p>
        <a href="{{applicationLink}}" class="btn">Review Application</a>
      </div>
      {{/newApplications}}
    </div>

    <div class="section">
      <h2>âš ï¸ Risk Alerts</h2>
      {{#riskAlerts}}
      <div class="loan-card">
        <strong>{{alertType}}</strong>
        <p>{{alertDescription}}</p>
        <a href="{{alertLink}}" class="btn">View Details</a>
      </div>
      {{/riskAlerts}}
    </div>

    <div class="section">
      <h2>ðŸ’° Loan Performance</h2>
      <p><strong>Payments Received Today:</strong> {{paymentsReceived}}</p>
      <p><strong>Overdue Loans:</strong> {{overdueLoans}}</p>
      <p><strong>Upcoming Settlements:</strong> {{upcomingSettlements}}</p>
    </div>

    <div class="footer">
      <p>Â© 2024 Grow MIP. All rights reserved.</p>
      <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{preferencesLink}}">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

export const LawyerDailyEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%); color: white; padding: 30px; text-align: center; }
    .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .case-card { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #8e2de2; }
    .priority-indicator { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .priority-high { background: #f8d7da; color: #721c24; }
    .priority-medium { background: #fff3cd; color: #856404; }
    .priority-low { background: #d4edda; color: #155724; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #8e2de2; }
    .btn { background: #8e2de2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .deadline-warning { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>âš–ï¸ Daily Legal Briefing</h1>
      <p>{{date}}</p>
    </div>

    <div class="section">
      <h2>ðŸ“Š Caseload Summary</h2>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{activeCases}}</div>
          <div>Active Cases</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{pendingReviews}}</div>
          <div>Pending Reviews</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{upcomingDeadlines}}</div>
          <div>This Week</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>â° Urgent: Deadlines Today</h2>
      {{#todayDeadlines}}
      <div class="deadline-warning">
        <strong>âš ï¸ {{caseReference}}</strong>
        <p>{{deadlineDescription}}</p>
        <p><strong>Due:</strong> {{deadlineTime}}</p>
        <a href="{{caseLink}}" class="btn">View Case</a>
      </div>
      {{/todayDeadlines}}
    </div>

    <div class="section">
      <h2>ðŸ“‹ Cases Requiring Review</h2>
      {{#casesForReview}}
      <div class="case-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{caseReference}}</h3>
          <span class="priority-indicator priority-{{priority}}">{{priority}} Priority</span>
        </div>
        <p><strong>Type:</strong> {{caseType}} | <strong>Status:</strong> {{caseStatus}}</p>
        <p><strong>Client:</strong> {{clientName}}</p>
        <p><strong>Action Required:</strong> {{actionRequired}}</p>
        <a href="{{caseLink}}" class="btn">Review Case</a>
      </div>
      {{/casesForReview}}
    </div>

    <div class="section">
      <h2>ðŸ“„ New Contract Requests</h2>
      {{#newContracts}}
      <div class="case-card">
        <h3>{{contractType}}</h3>
        <p><strong>Client:</strong> {{clientName}}</p>
        <p><strong>Property:</strong> {{propertyAddress}}</p>
        <p><strong>Value:</strong> {{contractValue}}</p>
        <a href="{{contractLink}}" class="btn">Draft Contract</a>
      </div>
      {{/newContracts}}
    </div>

    <div class="section">
      <h2>ðŸ“… Upcoming This Week</h2>
      <ul>
        {{#upcomingEvents}}
        <li><strong>{{eventDate}}</strong>: {{eventDescription}} - <a href="{{eventLink}}">Details</a></li>
        {{/upcomingEvents}}
      </ul>
    </div>

    <div class="footer">
      <p>Â© 2024 Grow MIP. All rights reserved.</p>
      <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{preferencesLink}}">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

export const CaseUpdateEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
    .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .update-card { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #f093fb; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .status-progress { background: #cfe2ff; color: #084298; }
    .status-completed { background: #d1e7dd; color: #0a3622; }
    .status-pending { background: #fff3cd; color: #664d03; }
    .timeline-item { padding: 15px 0; border-left: 2px solid #dee2e6; padding-left: 20px; position: relative; }
    .timeline-item:before { content: ''; width: 12px; height: 12px; background: #f093fb; border-radius: 50%; position: absolute; left: -7px; top: 20px; }
    .btn { background: #f093fb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ðŸ“¢ Case Update Notification</h1>
      <p>{{date}}</p>
    </div>

    <div class="section">
      <h2>Case: {{caseReference}}</h2>
      <p><strong>Property:</strong> {{propertyAddress}}</p>
      <p><strong>Current Status:</strong> <span class="status-badge status-{{statusClass}}">{{caseStatus}}</span></p>
    </div>

    <div class="section">
      <h2>ðŸ“‹ Today's Updates</h2>
      {{#updates}}
      <div class="update-card">
        <strong>{{updateTime}}</strong> - {{updateTitle}}
        <p>{{updateDescription}}</p>
        {{#hasDocument}}
        <p><a href="{{documentLink}}">ðŸ“Ž View Document</a></p>
        {{/hasDocument}}
      </div>
      {{/updates}}
    </div>

    <div class="section">
      <h2>â±ï¸ Case Timeline</h2>
      {{#timelineEvents}}
      <div class="timeline-item">
        <strong>{{eventDate}}</strong>
        <p>{{eventDescription}}</p>
      </div>
      {{/timelineEvents}}
    </div>

    <div class="section">
      <h2>ðŸ“Š Case Progress</h2>
      <p><strong>Completion:</strong> {{completionPercentage}}%</p>
      <div style="background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); height: 100%; width: {{completionPercentage}}%;"></div>
      </div>
      <p style="margin-top: 15px;"><strong>Next Milestone:</strong> {{nextMilestone}}</p>
      <p><strong>Expected Date:</strong> {{nextMilestoneDate}}</p>
    </div>

    <div class="section">
      <h2>ðŸ‘¥ Parties Involved</h2>
      <ul>
        {{#parties}}
        <li><strong>{{role}}:</strong> {{name}} ({{email}})</li>
        {{/parties}}
      </ul>
    </div>

    <div class="section">
      <h2>âš ï¸ Action Required</h2>
      {{#actionItems}}
      <div class="update-card">
        <strong>{{actionTitle}}</strong>
        <p>{{actionDescription}}</p>
        <p><strong>Due Date:</strong> {{dueDate}}</p>
        <a href="{{actionLink}}" class="btn">Take Action</a>
      </div>
      {{/actionItems}}
    </div>

    <div class="footer">
      <p><a href="{{caseLink}}" class="btn">View Full Case Details</a></p>
      <p style="margin-top: 20px;">Â© 2024 Grow MIP. All rights reserved.</p>
      <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{preferencesLink}}">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

// Email Template Renderer
export function renderEmailTemplate(template: string, data: any): string {
  let rendered = template;
  
  // Simple mustache-style template rendering
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, data[key]);
  });
  
  // Handle array iteration (simplified)
  const arrayMatches = rendered.match(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g);
  if (arrayMatches) {
    arrayMatches.forEach(match => {
      const arrayName = match.match(/{{#(\w+)}}/)?.[1];
      if (arrayName && Array.isArray(data[arrayName])) {
        const itemTemplate = match.replace(/{{#\w+}}/, '').replace(/{{\/\w+}}/, '');
        const renderedItems = data[arrayName].map((item: any) => {
          let itemHtml = itemTemplate;
          Object.keys(item).forEach(itemKey => {
            const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
            itemHtml = itemHtml.replace(itemRegex, item[itemKey]);
          });
          return itemHtml;
        }).join('');
        rendered = rendered.replace(match, renderedItems);
      }
    });
  }
  
  return rendered;
}

