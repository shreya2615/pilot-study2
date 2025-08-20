var style = document.createElement('style');
style.innerHTML = `
  body {
    font-size: 22px !important;
  }
`;
document.head.appendChild(style);

// Initialize Firebase (put at the top of experiment.js)
const firebaseConfig = {
  apiKey: "AIzaSyBeS5cpBQ-hniexN4urdqMkMiGPKZiqj2k",
  authDomain: "pilot-study2.firebaseapp.com",
  databaseURL: "https://pilot-study2-default-rtdb.firebaseio.com",
  projectId: "pilot-study2",
  storageBucket: "pilot-study2.firebasestorage.app",
  messagingSenderId: "645327983730",
  appId: "1:645327983730:web:eddc5ac2b37e21e3aa5eeb"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: true
});

const group = jsPsych.randomization.sampleWithoutReplacement(["male", "female"], 1)[0];

const participantID = jsPsych.data.getURLVariable("id") || Math.floor(Math.random() * 1000000);
jsPsych.data.addProperties({ participantID });


const logToFirebase = (trialData) => {
  const participantID = jsPsych.data.get().values()[0]?.participantID || "unknown";
  const baseEntry = {
    participantID,
    group,
    block: trialData.block,              // e.g. "CEO Scenario 1"
    scenario: trialData.scenario,        // e.g. "CEO"
    version: trialData.version,          // 1 or 2
    timestamp: Date.now()
  };

  const responses = trialData.responses || {};

  for (let key in responses) {
    const value = responses[key];
    const isRating = key.startsWith("rating_");
    const isRank = key.startsWith("rank_");

    if (isRating || isRank) {
      const entry = {
        ...baseEntry,
        candidate: key.replace(/^rating_|^rank_/, ''), // remove prefix
        questionType: isRating ? "rating" : "ranking",
        response: value
      };

      database.ref(`participants/${participantID}/trials`).push(entry);
    }
  }
};

const instructions_exp = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <h2>Welcome to this experiment</h2>
    <p>In this study, you will be asked to imagine a scenario where you are on a committee to help four different companies that are looking to hire an employee.</p>
    <p>For each company, six applicants have been highlighted for further consideration. Your task is to read through the company's requirements and each applicant's profile, then rate how likely you are on a scale of 1-7 to select each applicant for an interview and rank them based on how well you think they fit the position.</p> 
    <p>This study will take approximately <strong>15 minutes</strong> to complete. Please respond as thoughtfully and accurately as possible.</p>
    <p>If you wish to stop at any point, simply close the window and your data will not be recorded.</p>
    <p>Press <strong>SPACE</strong> to begin the study.</p>
  `,
  choices: [' ']
};

const ceoScenario1 = {
  name: "CEO Scenario 1",
  data: { scenario: "CEO", version: 1 },
  jobDescription: `
    <h2>Job Posting: Chief Executive Officer (CEO)</h2>
    <p><strong>Location:</strong> Toronto, ON</p>
    <p><strong>About the Company:</strong> NovaLink is a tech firm with a team of 5000 employees that builds smart software to help companies manage their supply chains. We’ve grown across North America and are now preparing to expand into Europe. At the same time, we’re dealing with a hostile takeover attempt from a U.S. competitor. We want to remain independent and grow internationally, without losing our focus or team stability. We are looking for a new CEO to help navigate these challenges and opportunities.</p>
  `,
  candidates: [
    {
      name: "Richard",
      description: `In my last role, I oversaw expansion of the company into Germany and the Netherlands. I speak German and have a network of contacts in both countries.  Shortly after initiating the expansion, we were confronted by an aggressive takeover attempt. I worked directly with the board and our lawyers, investors, and regulators to fend off the aggression and safeguard shareholder value, while also keeping focus on our long-term corporate goals. I keep people calm and grounded when things heat up.`
    },
    {
      name: "Neil",
      description: `In my most recent leadership position, I helped guide a company through a hostile takeover attempt. It was a stressful and uncertain time, but I kept the leadership team aligned and worked closely with our lawyers, investors, and regulators to protect the company’s interests. I try to keep people informed and moving forward when the pressure is on. In a previous position I was the VP in charge of acquisitions and navigated several successful mergers and takeovers for a large multinational company.`
    },
    {
      name: "Scott",
      description: `I have successfully led the launch of software technology products in Europe as the vice president of a multinational company. I also helped set up our first offices and client networks in both Germany and Spain. I am fully conversant in German and French, and I know how to effectively navigate cultural and regulatory differences in various contexts. I’m excited about helping companies grow across borders and I like being the person who connects the dots between people and markets.`
    },
    {
      name: "John",
      description: `I have successfully led corporate organizations through intense and challenging internal changes, including board turnover and investor turmoil, while helping the company maintain steady focus and consistently grow profits over time. I have also worked very closely with legal teams on contract disputes, negotiations, and restructuring plans. What I bring to the table is the ability to keep a company calm, collected, and focused while things shift around them.`
    },
    {
      name: "Derek",
      description: `My leadership experience includes opening offices and establishing key partnerships in several major Asian markets, including China and South Korea, for a multinational technology company. I am fluent in Mandarin and have helped local teams effectively adjust to new evolving regulations while building long-term relationships in those specific regions. I am fully accustomed to managing time zones and cultural differences, and I truly enjoy bringing global teams together.  `
    },
    {
      name: "Michael",
      description: `In my last position, I served as the lead vice president in charge of managing the business through a major internal restructuring process that followed a large-scale corporate merger. My responsibilities included integrating cross functional teams, aligning operations, finding cost efficiencies, and working through overlapping leadership roles. I have worked extensively across North America, and I tend to approach leadership with a steady, systems-based, and solution-oriented mindset.`
    }
  ]
};

const ceoScenario2 = {
  name: "CEO Scenario 2",
  data: { scenario: "CEO", version: 2 },
  jobDescription: `
    <h2>Job Posting: Chief Executive Officer (CEO)</h2>
    <p><strong>Location:</strong> Vancouver, BC</p>
    <p><strong>About the Company:</strong> GreenPath develops software to help other companies track and reduce their environmental impact in Canada and Europe. We’ve grown quickly to a team of 500, but that growth has created new pressures. We’ve fallen behind in updating our tools and platforms to keep up with new climate regulations, particularly in Europe.  Furthermore, our switch back from remote to in-office mode after the COVID lockdowns has left some staff dissatisfied and unheard. We now want to consolidate and focus on doing two things better: staying ahead of environmental standards and making GreenPath a more connected and desirable place to work. We are looking for a new CEO to help us achieve these goals.</p>
  `,
  candidates: [
    {
      name: "Thomas",
      description: `As vice president of a multinational green tech company, I led system updates in Germany and France to help clients comply with new EU climate regulations. Around the same time, COVID restrictions forced a shift to remote work, which caused isolation, low morale, and a loss of shared purpose. I implemented several initiatives to address these challenges, resulting in an 87% increase in retention and a 73% boost in job satisfaction over the next three years. To me, leadership means being steady, compassionate, empathetic, and mission focused. I still bike to work and strive to live by the values we promote.`
    },
    {
      name: "Peter",
      description: `After serving in a number of senior leadership roles within private industry, I currently lead the government agency responsible for overseeing the development, coordination, and implementation of environmental regulations for the European Union. This position requires not only deep knowledge of high-level strategy and regulatory guidelines, but also a detailed understanding of the political nuances, compliance challenges, and operational complexities of individual member countries. I am now looking to return to the private sector to leverage my insider expertise to help companies better understand and navigate evolving European environmental standards.`
    },
    {
      name: "James",
      description: `I was appointed VP head of human resources while my current company was struggling with low morale and employee retention. My approach was to empathize and view the situation from the employee’s perspective. I initiated steps to make the employees feel heard at every level. This led to the opening of corporate daycare facilities and encouraging flexible hours. We also initiated regular company retreats to reinforce team cohesion. After three years our employee retention rate is 95% and corporate morale at an all-time high. I believe engaged, motivated employees are essential to long-term success and overall profitability.`
    },
    {
      name: "Brian",
      description: `I have held leadership positions at the vice president level in both marketing and finance across several well-established multinational corporations. In my marketing role, we successfully increased U.S. market share by 12% over a two-year period. In the finance position, I implemented strategic measures to reduce company debt and boost shareholder equity, which ultimately resulted in a 54% increase in our stock value. I consider myself a well-rounded, seasoned corporate executive with a strong track record of results who can position your organization for sustained growth and long-term profitability.`
    },
    {
      name: "Greg",
      description: `I am a software engineer by training and have led large teams over the last two decades.  In my current position as VP for innovation and development for an American high-tech company I lead teams that develop software for a range of applications but with a specialization in satellite monitoring and ballistic trajectories.  Our major clients are the US government and the Pentagon.  This role has given me considerable experience in dealing with government regulations and how to respond to them quickly and effectively.`
    },
    {
      name: "Martin",
      description: `I specialize in growing midsize companies through strategic acquisitions and post-merger integration.  In my most recent position as CEO of a security software company, we expanded the organization from 350 employees to 1,500 within just three years. This rapid growth was primarily achieved through the successful acquisition of three companies based in South Korea, Hong Kong, and Japan.  Following the acquisitions, we carefully shed redundancies and consolidated operations to streamline efficiency, emerging as a more competitive and profitable organization. I focus on growth through strategic acquisition and integration.`
    }
  ]
};

const eceScenario1 = {
  name: "ECE Scenario 1",
  data: { scenario: "ECE", version: 1 },
  jobDescription: `
    <h2>Job Posting: Early Childhood Educator (ECE)</h2>
    <p><strong>Location:</strong> Toronto, ON</p>
    <p><strong>About the Company:</strong> Little Steps Early Learning Centre is a large, multi-centre daycare located in various parts of the Greater Toronto Area. Our downtown Toronto centre currently serves 45 children with a team of 8 dedicated staff members. Recently, the centre has been facing increasing challenges related to (i) staff adopting to new curriculum regulations and (ii) classroom management and disruptive behaviour. As a result, the centre is seeking an Early Childhood Educator (ECE) who can provide a firm lead to staff and navigate both staff and classroom conflict effectively.</p>
  `,
  candidates: [
    {
      name: "Jess (ECE, University of Toronto)",
      description: `I have worked as a daycare supervisor in the city for the past five years, managing classroom dynamics, staff, and behavioural difficulties. When our center adopted a new play-based curriculum, I supported staff by facilitating planning sessions and sharing strategies that made the shift feel manageable and aligned with their teaching styles. As a supervisor I’ve also managed incidents between children involving disruptive behaviours during class time. By implementing firm and consistent expectations, I was able to prevent further outbursts.`
    },
    {
      name: "Mary (ECE, University of Toronto)",
      description: `For the past three years, I have worked as a staff lead at a preschool where I take pride in fostering a positive team culture rooted in accountability, communication, and respect. This focus on team culture has shaped how I support staff through change and new initiatives. As we adopted changes in the curriculum, I collaborated with staff to create simple templates and provide hands-on support. This helped reduce stress and misunderstanding and facilitated greater consistency across classrooms.`
    },
    {
      name: "Sarah (ECE, University of Toronto)",
      description: `I have worked for four years as an educator at a childcare centre in Etobicoke, where I efficiently manage the classroom. I’ve supported classrooms facing disruptive behaviors by modeling calm, consistent responses and working closely with educators to develop shared strategies. When disagreements arise between children, I help them explore fair ways to share or take turns. I’ve found that encouraging empathy prevents miscommunication while teaching valuable social skills. I also support team dynamics by encouraging open dialogue and stepping in early to prevent issues from escalating. `
    },
    {
      name: "Amy (BA, University of Toronto)",
      description: `I’ve spent the past three years working as a receptionist at a drop-in children’s program. During this time, I have interacted with and developed meaningful connections with families. I have observed educators as they led children’s activities and managed various behavioural challenges. I am currently pursuing a degree in Early Childhood Education and am eager to take the next step in this field. I would love the opportunity to apply my knowledge and gain hands-on experience working directly with children.`
    },
    {
      name: "Alyssa (ECE, University of Toronto)",
      description: `I have spent the last four years working as a preschool educator. To manage disruptive behaviors, I enjoy creating a calm and predictable learning environment. I stick to tried-and-true strategies that have worked well in the past for me. For example, when two children are arguing over a toy, I calmly step in to help them express their feelings and guide them toward finding a fair solution. I value open communication and always try to understand each child’s perspective.`
    },
    {
      name: "Rebecca (ECE, University of Toronto)",
      description: `I have three years of experience working as an educator at a learning centre in downtown Toronto. In that role, I guided children through daily activities to support their learning and development. I worked closely with children to build routines that encouraged engagement and confidence. For instance, I regularly led circle time activities, prompting children to participate in games and sing-alongs. Outside of work, I coach a youth soccer team and have received recognition for leading the most improved team.`
    }
  ]
};

const eceScenario2 = {
  name: "ECE Scenario 2",
  data: { scenario: "ECE", version: 2 },
  jobDescription: `
    <h2>Job Posting: Early Childhood Educator (ECE)</h2>
    <p><strong>Location:</strong> Vancouver, BC</p>
    <p><strong>About the Company:</strong> Early Minds Academy is a large, multi-centre daycare located in various parts of the Greater Vancouver Area. Our downtown Vancouver centre currently serves 45 children with a team of 8 dedicated staff members. At this time, the centre is in the process of enhancing its program to align more closely with child-centered approaches that prioritize emotional development and interpersonal learning. As a result, the centre is seeking an Early Childhood Educator (ECE) who is warm, nurturing, and emotionally attuned. The ideal candidate will foster close relationships with children and families and have a strong passion for learning.</p>
  `,
  candidates: [
    {
      name: "Veronica (ECE, University of British Columbia)",
      description: `I have worked at a daycare in the city for the past four years. I’ve come to understand that every child has their own unique needs and establish rapport accordingly. For children who need more support, I provide one-on-one attention or adapt activities to cater to their level of development. I love speaking with parents about how their child’s day went, whether it was full of laughter or included a few bumps along the way.`
    },
    {
      name: "Maya (ECE, University of British Columbia)",
      description: `For the past three years, I have worked at a preschool where I feel honoured to be part of the children’s developmental milestones. I value the importance of clear communication, and I like to host a monthly ‘family morning’ where parents and children can join in on a circle time activity and parents chat informally about their child’s progress. Outside of work, I regularly take professional development courses that I can apply to my own role, as I strongly believe in the value of continual growth.`
    },
    {
      name: "Clara (ECE, University of British Columbia)",
      description: `For the past three years, I’ve worked as a private babysitter for two different families. In these roles, I focused on supporting emotional development by using practical strategies. When any of the children would get upset after losing a game or being told “no”, I would offer simple strategies like counting to ten or taking deep breaths.  I focus on incorporating evidence-based approaches into my work and enjoy staying up to date with current research to support children’s development.`
    },
    {
      name: "Julia (BA, University of British Columbia)",
      description: `I spent the past two years working in toddler and preschool classrooms. In these roles, my main focus was helping to plan activities and maintain structured routines for the lead educators to follow. As an activity planner, I communicated effectively with lead educators to develop cohesive daily routines and have maintained contact with many of them even after my contract ended. I highly value continual growth and am always researching new activities that maximize children’s learning and health development.`
    },
    {
      name: "Zoe (ECE, University of British Columbia)",
      description: `I have spent the last four years working as a play-based educator. My favourite part about being an educator is the novelty of each day. I love seeing where each child’s curiosity takes us, whether it’s coming up with a new science experiment or exploring a new art technique - whatever keeps everyone engaged and learning. I also have a strong interest in storytelling and music, which I often bring into the classroom to spark imagination and engage children in new ways.`
    },
    {
      name: "Naomi (ECE, University of British Columbia)",
      description: `I have four years of experience working as a classroom assistant, helping implement learning activities and supporting daily routines. I make the effort to speak with parents informally during drop-off and pickup, and I appreciate how these interactions can help build trust over time. I’ve also volunteered at local community events, allowing me to collaborate with different age groups and support environments that bring people together. These are values I hope to bring into my work with children and their families.`
    }
  ]
};


// Function to create the rating and ranking trial for each scenario
function createTrialWithRatingsAndRanking(scenario) {
  const candidateCount = scenario.candidates.length;

  // Candidate profiles + Likert rating blocks
  const candidateSections = scenario.candidates.map((c, i) => {
    const id = c.name.replace(/\s+/g, '');
    return `
      <div style="margin-bottom: 30px;">
        <strong>${i + 1}. ${c.name}</strong><br>
        <p>${c.description}</p>
        <label for="rating_${id}"><strong>How likely are you to select this applicant for an interview? (1 = Very Unlikely, 7 = Very Likely)</strong></label><br>
        <input 
          type="range" 
          id="rating_${id}" 
          name="rating_${id}" 
          min="1" 
          max="7" 
          step="1" 
          style="width: 60%; display: block; margin: 0 auto;"
        >
        <div style="display: flex; justify-content: space-between; padding: 0 4px; font-weight: bold; width: 60%; margin: 0 auto;">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
        </div>
      </div>
    `;
  }).join("");

  // Ranking input section
const rankingInputs = scenario.candidates.map(c => {
    const id = c.name.replace(/\s+/g, '');
    return `
      <label for="rank_${id}">${c.name}:</label>
      <input 
        type="number" 
        id="rank_${id}" 
        name="rank_${id}" 
        min="1" 
        max="${candidateCount}" 
        required
        style="
          width: 50px; 
          height: 30px; 
          font-size: 17px; 
          text-align: center; 
          margin-bottom: 10px;
        "
      ><br><br>
    `;
}).join("");

  const htmlBlock = `
    ${candidateSections}
    <hr>
    <div style="
        border: 2px solid #333;
        padding: 20px;
        border-radius: 10px;
        width: 60%;
        margin: 0 auto;
        background-color: #f9f9f9;
    ">
        <p><strong>Ranking Task:</strong> Please rank the applicants from 1 (best fit) to ${candidateCount} (least fit). Please assign a unique rank number to each applicant.</p>
        ${rankingInputs}
        <button id="customSubmit" type="button" style="
            font-size: 16px;
            padding: 10px 20px;
            margin-top: 10px;
        ">Submit</button>
        <div id="errorMsg" style="color:red; font-weight:bold;"></div>
    </div>
  `;

  // Then in your trial object:

  return {
    type: jsPsychSurveyHtmlForm,
    preamble: scenario.jobDescription + "<hr><h3>Applicants:</h3>",
    html: htmlBlock,
    data: scenario.data,
    on_load: function() {

        // 1. Try removing the button immediately (in case it’s already there)
        const tryRemoveButton = () => {
            const defaultBtn = document.querySelector('.jspsych-btn');
            if (defaultBtn) defaultBtn.remove();
        };

        tryRemoveButton(); // run immediately

        // 2. Then observe future mutations in case button is added late
        const observer = new MutationObserver((mutations, obs) => {
            tryRemoveButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 3. Form logic for validation
        const btn = document.getElementById("customSubmit");
        const form = document.querySelector("form");
        const errorMsg = document.getElementById("errorMsg");

        btn.addEventListener("click", () => {
            const formData = new FormData(form);
            const ranks = [];

            for (let [key, val] of formData.entries()) {
                if (key.startsWith("rank_")) {
                    ranks.push(Number(val));
                }
            }

            const uniqueRanks = new Set(ranks);
            const expected = [...Array(candidateCount)].map((_, i) => i + 1);

            if (ranks.some(val => isNaN(val))) {
                errorMsg.textContent = "Please enter a valid numeric rank for each candidate.";
                return;
            }

            if (uniqueRanks.size !== ranks.length) {
                errorMsg.textContent = "Each candidate must have a unique rank. Please check your responses.";
                return;
            }

            if (!expected.every(num => ranks.includes(num))) {
                errorMsg.textContent = `Please use each number from 1 to ${candidateCount} exactly once.`;
                return;
            }

            // Validation passed: clear error and finish trial manually
            errorMsg.textContent = "";
            observer.disconnect(); // stop watching for button
            const trialData = { 
  ...scenario.data, 
  responses: Object.fromEntries(formData.entries()),
  block: scenario.name
};

logToFirebase(trialData);
jsPsych.finishTrial(trialData);

        });
    },
  };
}

const allScenarios = [ceoScenario1, ceoScenario2, eceScenario1, eceScenario2];
const randomizedScenarios = jsPsych.randomization.shuffle(allScenarios);
const allCombinedTrials = randomizedScenarios.map(scenario => {
  const shuffledCandidates = jsPsych.randomization.shuffle(scenario.candidates);
  return createTrialWithRatingsAndRanking({...scenario, candidates: shuffledCandidates });
});

// Add your instructions and then these trials to timeline
let timeline = [];

timeline.push(instructions_exp);
timeline = timeline.concat(allCombinedTrials);

// === Final Message ===
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <h2>Thank you for participating!</h2>
    <p>Your responses have been recorded.</p>
    <p>You may now close this window.</p>
  `,
  choices: "NO_KEYS",
  trial_duration: 5000
});

jsPsych.run(timeline);
