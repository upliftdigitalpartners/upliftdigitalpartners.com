// Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const topBar = document.querySelector('.top-bar');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    if (topBar) topBar.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.service-card, .process-step, .portfolio-card, .testimonial-card, .stat-item, .chat-window, .sidebar-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // --- CHAT CONSULTATION FLOW ---
  const COMPANY_EMAIL = 'upliftdigitalpartners@gmail.com';
  const chatData = {
    answers: {},
    step: 0,
    steps: [
      { key: 'name', type: 'text', placeholder: 'Type your name...' },
      { key: 'business', type: 'text', placeholder: 'Your business name...' },
      { key: 'service', type: 'chips', options: ['Custom Website', 'Website Revamp', 'Brand & UI Design', 'SEO & Local Search', 'Ongoing Support', 'Not Sure Yet'] },
      { key: 'details', type: 'text', placeholder: 'Tell us briefly...' },
      { key: 'email', type: 'text', placeholder: 'your@email.com' },
      { key: 'phone', type: 'text', placeholder: '(555) 123-4567 or skip' },
      { key: 'meetingType', type: 'chips', options: ['\u{1F3A5} Video Call (Google Meet)', '\u{1F91D} In-Person Meeting'] },
      { key: 'address', type: 'text', placeholder: '123 Main St, City, State...', skipIf: 'video' },
      { key: 'date', type: 'calendar' },
      { key: 'time', type: 'timeslots' },
      { key: 'confirm', type: 'auto' }
    ]
  };

  function isVideoCall() {
    return chatData.answers.meetingType && chatData.answers.meetingType.indexOf('Video') !== -1;
  }

  function getBotMessage(step, answers) {
    var s = chatData.steps[step];
    if (!s) return "";
    switch(s.key) {
      case 'name': return "Hey there! \u{1F44B} I'm the Uplift Digital assistant. I'd love to help you book a free consultation with our team. Let's get started \u2014 what's your name?";
      case 'business': return "Nice to meet you, <strong>" + answers.name + "</strong>! What's your business called?";
      case 'service': return "Great \u2014 <strong>" + answers.business + "</strong> sounds interesting! What kind of help are you looking for?";
      case 'details': return "Good choice! Can you give us a quick idea of what you have in mind? A sentence or two is perfect.";
      case 'email': return "Got it! What's the best email address to reach you at?";
      case 'phone': return "Almost done with the basics! What's a good phone number? (Type <em>skip</em> if you'd rather not share one.)";
      case 'meetingType': return "How would you like to meet? We offer both virtual and in-person consultations:";
      case 'address': return "\u{1F4CD} We'd love to come to you! What's your office address?";
      case 'date': return "\u{1F4C5} Let's pick a date for your consultation. Choose a day that works:";
      case 'time': return "Great, <strong>" + answers.date + "</strong> it is! What time works best?";
      case 'confirm':
        var isVideo = isVideoCall();
        var meetLabel = isVideo ? "\u{1F3A5} Video Call (Google Meet)" : "\u{1F91D} In-Person Meeting";
        return "\u2728 You're all set, <strong>" + answers.name + "</strong>! Here's your consultation:<br><br>" +
        "\u{1F4BC} <strong>" + answers.business + "</strong><br>" +
        "\u{1F3AF} " + answers.service + "<br>" +
        "\u{1F4E7} " + answers.email + "<br>" +
        (answers.phone && answers.phone.toLowerCase() !== 'skip' ? "\u{1F4DE} " + answers.phone + "<br>" : "") +
        "\u{1F4AC} " + meetLabel + "<br>" +
        (!isVideo && answers.address ? "\u{1F4CD} " + answers.address + "<br>" : "") +
        "\u{1F4C5} " + answers.date + " \u2022 " + answers.time + "<br><br>" +
        (isVideo
          ? "\u{1F3A5} <strong>A Google Meet invite is being prepared for you.</strong>"
          : "\u{1F91D} <strong>We'll visit you at your office. A calendar invite is being prepared.</strong>") +
        "<br>We'll confirm everything within 24 hours. Talk soon! \u{1F680}";
      default: return "";
    }
  }

  const msgContainer = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const inputArea = document.getElementById('chatInputArea');

  function scrollChat() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        msgContainer.scrollTop = msgContainer.scrollHeight + 500;
      });
    });
  }

  // Backup: auto-scroll whenever chat content changes
  const chatScrollObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
      msgContainer.scrollTop = msgContainer.scrollHeight + 500;
    });
  });
  chatScrollObserver.observe(msgContainer, { childList: true, subtree: true });

  function addBubble(text, type) {
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + type;
    if (type === 'bot') div.innerHTML = '<span class="bot-label">Uplift Digital</span>' + text;
    else div.textContent = text;
    msgContainer.appendChild(div);
    scrollChat();
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typingDots';
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    msgContainer.appendChild(div);
    scrollChat();
  }

  function removeTyping() {
    const el = document.getElementById('typingDots');
    if (el) el.remove();
  }

  function addChips(options) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-chips';
    wrapper.id = 'activeChips';
    options.forEach(function(opt) {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = opt;
      btn.setAttribute('data-chip-value', opt);
      wrapper.appendChild(btn);
    });
    wrapper.addEventListener('click', function(e) {
      if (e.target.hasAttribute('data-chip-value')) {
        var val = e.target.getAttribute('data-chip-value');
        wrapper.remove();
        processAnswer(val);
      }
    });
    msgContainer.appendChild(wrapper);
    scrollChat();
  }

  function addTimeSlots() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-time-grid';
    wrapper.id = 'activeChips';
    const slots = [
      { label: '9:00 AM', hour: 9 },
      { label: '10:00 AM', hour: 10 },
      { label: '11:00 AM', hour: 11 },
      { label: '12:00 PM', hour: 12 },
      { label: '1:00 PM', hour: 13 },
      { label: '2:00 PM', hour: 14 },
      { label: '3:00 PM', hour: 15 },
      { label: '4:00 PM', hour: 16 },
      { label: '5:00 PM', hour: 17 },
      { label: '6:00 PM', hour: 18 }
    ];
    slots.forEach(function(slot) {
      const btn = document.createElement('button');
      btn.className = 'chat-time-slot';
      btn.textContent = slot.label;
      btn.setAttribute('data-time-label', slot.label);
      btn.setAttribute('data-time-hour', slot.hour);
      wrapper.appendChild(btn);
    });
    wrapper.addEventListener('click', function(e) {
      if (e.target.hasAttribute('data-time-label')) {
        chatData.answers._hour = parseInt(e.target.getAttribute('data-time-hour'));
        var val = e.target.getAttribute('data-time-label');
        wrapper.remove();
        processAnswer(val);
      }
    });
    msgContainer.appendChild(wrapper);
    scrollChat();
  }

  // --- CALENDAR ---
  let calMonth, calYear;

  function buildCalendar(year, month) {
    calYear = year;
    calMonth = month;
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let html = '<div class="cal-header">';
    html += '<button class="cal-nav" data-cal-nav="-1">\u25C0</button>';
    html += '<span>' + monthNames[month] + ' ' + year + '</span>';
    html += '<button class="cal-nav" data-cal-nav="1">\u25B6</button>';
    html += '</div><div class="cal-days">';

    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d) {
      html += '<div class="cal-day-label">' + d + '</div>';
    });

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day cal-empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = date.toDateString() === today.toDateString();
      let cls = 'cal-day';
      if (isPast || isWeekend) cls += ' cal-disabled';
      if (isToday) cls += ' cal-today';

      if (isPast || isWeekend) {
        html += '<div class="' + cls + '">' + d + '</div>';
      } else {
        const dateStr = monthNames[month] + ' ' + d + ', ' + year;
        const isoDate = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
        html += '<button class="' + cls + '" data-date-str="' + dateStr + '" data-iso-date="' + isoDate + '">' + d + '</button>';
      }
    }

    html += '</div>';
    return html;
  }

  function addCalendar() {
    const today = new Date();
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-calendar';
    wrapper.id = 'activeChips';
    wrapper.innerHTML = buildCalendar(today.getFullYear(), today.getMonth());

    // Event delegation for all calendar clicks
    wrapper.addEventListener('click', function(e) {
      var target = e.target;
      // Nav buttons
      if (target.hasAttribute('data-cal-nav')) {
        var dir = parseInt(target.getAttribute('data-cal-nav'));
        calMonth += dir;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        if (calMonth < 0) { calMonth = 11; calYear--; }
        wrapper.innerHTML = buildCalendar(calYear, calMonth);
        return;
      }
      // Date buttons
      if (target.hasAttribute('data-date-str')) {
        var dateStr = target.getAttribute('data-date-str');
        var isoDate = target.getAttribute('data-iso-date');
        chatData.answers._isoDate = isoDate;
        wrapper.remove();
        processAnswer(dateStr);
      }
    });

    msgContainer.appendChild(wrapper);
    scrollChat();
  }


  function setInputState(step) {
    const s = chatData.steps[step];
    if (!s || s.type === 'auto' || s.type === 'chips' || s.type === 'timeslots' || s.type === 'calendar') {
      inputArea.style.display = 'none';
    } else {
      inputArea.style.display = 'flex';
      chatInput.placeholder = s.placeholder || 'Type your answer...';
      chatInput.value = '';
      chatInput.focus();
    }
  }

  function processAnswer(value) {
    addBubble(value, 'user');
    chatData.answers[chatData.steps[chatData.step].key] = value;
    chatData.step++;

    // Skip address step if they chose video call
    if (chatData.step < chatData.steps.length && chatData.steps[chatData.step].key === 'address' && isVideoCall()) {
      chatData.step++;
    }

    advanceChat();
  }

  function advanceChat() {
    const step = chatData.step;
    if (step >= chatData.steps.length) return;
    showTyping();
    const delay = step === 0 ? 800 : 1000 + Math.random() * 600;
    setTimeout(function() {
      removeTyping();
      addBubble(getBotMessage(step, chatData.answers), 'bot');
      const s = chatData.steps[step];
      if (s.type === 'chips') { addChips(s.options); setInputState(step); }
      else if (s.type === 'timeslots') { addTimeSlots(); setInputState(step); }
      else if (s.type === 'calendar') { addCalendar(); setInputState(step); }
      else if (s.type === 'auto') {
        inputArea.style.display = 'none';
        finalizeBooking();
      } else { setInputState(step); }
    }, delay);
  }

  function sendChat() {
    const val = chatInput.value.trim();
    if (!val) return;
    processAnswer(val);
  }

  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  // ─── EMAILJS CONFIG ───
  // Sign up at https://www.emailjs.com (free: 200 emails/month)
  // 1. Create an Email Service (connect your Gmail)
  // 2. Create two Email Templates:
  //    - "booking_owner" → notification to you (upliftdigitalpartners@gmail.com)
  //    - "booking_client" → confirmation to the client
  // 3. Copy your Public Key, Service ID, and Template IDs below:
  var EMAILJS_PUBLIC_KEY = 'CcPOuyJ6RlKbUYLYs';     // from EmailJS dashboard > Account
  var EMAILJS_SERVICE_ID = 'service_f5jkuya';     // from EmailJS > Email Services
  var EMAILJS_TEMPLATE_OWNER = 'booking_owner';   // template for your team
  var EMAILJS_TEMPLATE_CLIENT = 'booking_client'; // template for the client

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // --- FINALIZE: Auto-Email + Google Calendar ---
  function finalizeBooking() {
    var a = chatData.answers;
    var isVideo = isVideoCall();
    var meetTypeLabel = isVideo ? 'Video Call (Google Meet)' : 'In-Person Meeting';

    // Build the template parameters (used by both templates)
    var templateParams = {
      client_name: a.name,
      client_email: a.email,
      client_phone: (a.phone && a.phone.toLowerCase() !== 'skip') ? a.phone : 'N/A',
      business_name: a.business,
      service: a.service,
      details: a.details,
      meeting_type: meetTypeLabel,
      address: (!isVideo && a.address) ? a.address : 'N/A (Video Call)',
      date: a.date,
      time: a.time,
      owner_email: COMPANY_EMAIL
    };

    // --- AUTO-SEND EMAILS ---
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      // Email to YOU (the business owner)
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER, templateParams)
        .then(function() {
          console.log('Owner email sent');
          showEmailStatus('sent');
        }, function(err) {
          console.error('Owner email failed:', err);
          showEmailStatus('error');
        });

      // Confirmation email to the CLIENT
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLIENT, templateParams)
        .then(function() {
          console.log('Client confirmation sent');
        }, function(err) {
          console.error('Client email failed:', err);
        });
    } else {
      // EmailJS not configured — show manual fallback
      showEmailStatus('not-configured');
    }

    // --- GOOGLE CALENDAR LINK ---
    var isoDate = a._isoDate || '';
    var hour = a._hour || 10;
    var startDT = isoDate.replace(/-/g, '') + 'T' + String(hour).padStart(2, '0') + '0000';
    var endDT = isoDate.replace(/-/g, '') + 'T' + String(hour + 1).padStart(2, '0') + '0000';

    var calTitle = encodeURIComponent(
      isVideo
        ? 'Uplift Digital \u2014 Free Consultation with ' + a.name + ' (Video Call)'
        : 'Uplift Digital \u2014 In-Person Consultation with ' + a.name
    );
    var calDetails = encodeURIComponent(
      'Consultation with ' + a.name + ' from ' + a.business + '.\n\n' +
      'Meeting: ' + meetTypeLabel + '\n' +
      'Service: ' + a.service + '\n' +
      'Details: ' + a.details + '\n' +
      'Phone: ' + templateParams.client_phone + '\n' +
      (!isVideo && a.address ? 'Address: ' + a.address + '\n' : '') +
      '\n' + (isVideo ? 'Google Meet link included.' : 'In-person at client office.')
    );
    var calLocation = (!isVideo && a.address) ? '&location=' + encodeURIComponent(a.address) : '';

    var calURL = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + calTitle +
      '&dates=' + startDT + '/' + endDT +
      '&details=' + calDetails +
      '&add=' + encodeURIComponent(a.email) +
      '&add=' + encodeURIComponent(COMPANY_EMAIL) +
      calLocation +
      '&crm=AVAILABLE&trp=true';

    // --- SHOW ACTION BUTTONS ---
    setTimeout(function() {
      var actions = document.createElement('div');
      actions.className = 'chat-chips';
      actions.style.cssText = 'gap:0.6rem;flex-wrap:wrap;';

      var calBtn = document.createElement('a');
      calBtn.href = calURL;
      calBtn.target = '_blank';
      calBtn.className = 'chat-chip';
      calBtn.style.cssText = 'background:var(--teal);color:white;border-color:var(--teal);text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;';
      calBtn.innerHTML = isVideo ? '\u{1F4C5} Create Google Meet Invite' : '\u{1F4C5} Create Calendar Invite';

      actions.appendChild(calBtn);
      msgContainer.appendChild(actions);
      scrollChat();
    }, 1500);
  }

  // Email status indicator in chat
  function showEmailStatus(status) {
    setTimeout(function() {
      var statusBubble = document.createElement('div');
      statusBubble.className = 'chat-bubble bot';
      statusBubble.style.cssText = 'font-size:0.82rem;padding:0.65rem 1rem;';
      if (status === 'sent') {
        statusBubble.innerHTML = '<span class="bot-label">Uplift Digital</span>\u2705 <strong>Emails sent!</strong> A confirmation has been sent to both you and our team.';
      } else if (status === 'error') {
        statusBubble.innerHTML = '<span class="bot-label">Uplift Digital</span>\u26A0\uFE0F Email delivery had an issue. Don\'t worry \u2014 our team has your details and will reach out within 24 hours.';
      } else {
        statusBubble.innerHTML = '<span class="bot-label">Uplift Digital</span>\u{1F4E7} Our team has received your booking details and will email you a confirmation within 24 hours.';
      }
      msgContainer.appendChild(statusBubble);
      scrollChat();
    }, 2500);
  }

  // Start chat when section is visible
  var chatObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setTimeout(function() { advanceChat(); }, 500);
        chatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  chatObserver.observe(document.getElementById('chatWindow'));
