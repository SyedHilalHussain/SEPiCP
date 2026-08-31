// frontend/src/config/prompts.js
// Dedicated Prompt Repository for Columns A to CF, mapping all SEPiCP variables and fallback generators

export const COLUMN_PROMPTS = {
  // Column A
  "column_a": {
    column: "A",
    question: "Start Date",
    keys: ["start_date", "startdate"],
    prompts: []
  },

  // Column B
  "column_b": {
    column: "B",
    question: "Progress",
    keys: ["progress"],
    prompts: []
  },

  // Column C
  "column_c": {
    column: "C",
    question: "Your name",
    keys: ["your_name", "student_name", "instructor_name", "q1_name"],
    prompts: []
  },

  // Column D
  "column_d": {
    column: "D",
    question: "Please enter the name of your University or Institution.",
    keys: ["university", "q2_university"],
    prompts: []
  },

  // Column E
  "column_e": {
    column: "E",
    question: "Your academic email id.",
    keys: ["email", "q108_email"],
    prompts: []
  },

  // Column F
  "column_f": {
    column: "F",
    question: "Please mention the city, state and country where you teach/study.",
    keys: ["location", "q109_location"],
    prompts: []
  },

  // Column G
  "column_g": {
    column: "G",
    question: "Semester for which you are filling out this survey? - Selected Choice",
    keys: ["semester", "q3_semester"],
    prompts: [
      "The course is being evaluated for an earlier academic period, meaning the responses represent student experiences and teaching practices associated with that specific semester. Based on the academic corpus, what are key methods to analyze historical course data to identify persistent learning barriers?",
      "The survey represents a current or ongoing academic period, providing a contemporary view of how the course is being delivered and experienced by students. Based on the academic corpus, how can instructors gather and respond to mid-term student feedback to optimize course delivery in real time?",
      "The survey relates to a future or upcoming academic period, so the information may primarily represent planned or anticipated course delivery rather than completed classroom experiences. Based on the academic corpus, what proactive course design strategies should be implemented during the planning phase to ensure a successful syllabus?"
    ]
  },

  // Column H
  "column_h": {
    column: "H",
    question: "Semester for which you are filling out this survey?",
    keys: ["q3_semester_text", "q3_4_text"],
    prompts: []
  },

  // Column I
  "column_i": {
    column: "I",
    question: "Number and full title of the course you are reviewing here.",
    keys: ["course", "q4_course"],
    prompts: []
  },

  // Column J
  "column_j": {
    column: "J",
    question: "Is this an undergraduate (bachelors) or Graduate (Masters) degree class?",
    keys: ["degree_level", "q111_degree_level"],
    prompts: [
      "(Undergraduate/Bachelors): The course is taught at the undergraduate level, where students may benefit from greater foundational explanation, structured guidance, practical examples, and activities that progressively build conceptual understanding. Based on educational research, what are the most effective active learning strategies for building foundational skills in undergraduate students?",
      "(Graduate/Masters): The course is taught at the graduate level, where students are generally expected to engage with more advanced concepts, independent analysis, research-oriented discussion, and complex problem-solving. Based on educational research, how can instructors structure seminar discussions and independent research projects to foster critical analysis at the graduate level?",
      "(Mixed/Other): The course does not fit neatly into a single undergraduate or graduate category, suggesting that the teaching approach may need to accommodate students with different levels of academic preparation and experience. Based on educational research, how can differentiated instruction be applied to teach advanced topics to a mixed cohort?"
    ]
  },

  // Column K
  "column_k": {
    column: "K",
    question: "Please tell us approximately how many students are in this class.",
    keys: ["student_count", "q104_student_count"],
    prompts: [
      "(1–30 students): The class has a relatively small number of students, making it easier for the professor to provide individualized attention, conduct detailed discussions, monitor participation, and incorporate interactive activities. Based on research, what are the best practices for leveraging small class sizes to maximize student-centered learning?",
      "(31–50 students): The class has a moderate number of students, providing opportunities for interaction and group activities while still requiring the professor to deliberately structure participation and classroom management. Based on research, how can an instructor design scalable group work and structured discussions for medium-sized classes?",
      "(51+ students): The class has a relatively large number of students, which can make individualized interaction and full-class participation more challenging and may require structured group activities, technology-assisted engagement, and carefully managed discussions. Based on research, what strategies can maintain high engagement and personal connection in large lecture halls?"
    ]
  },

  // Column L
  "column_l": {
    column: "L",
    question: "What is the format of your class?",
    keys: ["class_format", "q105_class_format"],
    prompts: [
      "(Face-to-Face): The course is conducted primarily in a physical classroom, allowing direct interaction between the professor and students through in-person discussions, demonstrations, activities, and hands-on learning. Based on academic literature, what are the key benefits of face-to-face active learning and how can they be maximized?",
      "(Hybrid): The course combines face-to-face and online instruction, requiring the professor to effectively coordinate both physical and virtual learning environments while maintaining consistent student engagement across both formats. Based on academic literature, how can instructors design a cohesive hybrid model that bridges synchronous and asynchronous components?",
      "(Online): The course is delivered primarily online, requiring the professor to rely on digital communication, virtual discussions, online activities, and technology-supported methods to maintain interaction and student participation. Based on academic literature, what are the best virtual engagement strategies to build community in fully online courses?"
    ]
  },

  // Column M
  "column_m": {
    column: "M",
    question: "What percentage of your online class is synchronous, where you meet/work with the students live online?",
    keys: ["online_pct", "q107_1_online_pct"],
    prompts: [
      "(0–33%): Only a small portion of the online course involves live interaction with students. Most learning occurs asynchronously through recorded lectures, readings, assignments, discussion boards, or other independent activities. Based on research, how can asynchronous courses be structured with clear checkpoints to prevent student disengagement?",
      "(34–66%): A substantial portion of the online course involves live meetings, providing regular opportunities for real-time discussion, questioning, clarification, and interaction while still leaving significant learning activities for asynchronous work. Based on research, what is the optimal mix of synchronous interaction and asynchronous reflection in online higher education?",
      "(67–100%): Most of the online course is conducted through live sessions, creating frequent opportunities for real-time interaction, discussion, instructor feedback, collaborative activities, and immediate clarification of concepts. Based on research, how can instructors structure intensive synchronous online sessions to maintain high energy and prevent Zoom fatigue?"
    ]
  },

  // Column N
  "column_n": {
    column: "N",
    question: "Your role in this class? - Selected Choice",
    keys: ["role", "q_role", "q1_role", "user_role", "selected_choice"],
    prompts: [
      "Provide 2 basic, high-level tips for the teacher to engage a student with the profile of [Selected Choice].",
      "Analyze how [Selected Choice] impacts classroom expectations to generate 3 actionable strategies for targeted communication and support.",
      "Evaluate the deep pedagogical needs of this [Selected Choice] role, diagnosing friction points for a differentiated coaching plan."
    ]
  },

  // Column O
  "column_o": {
    column: "O",
    question: "Your role in this class? - Student. Please enter the name of your professor here - Text",
    keys: ["teacher_name", "professor_name", "q_prof_name", "q105_prof"],
    prompts: []
  },

  // Column P
  "column_p": {
    column: "P",
    question: "On a scale of 1 (Not Engaged) to 10 (Absolutely Engaged), to what extent do you think this class keeps the students engaged?",
    keys: ["total_engage", "engage_score", "overall_engagement", "total_engage_score_s", "engage_s", "engage_p"],
    prompts: [
      "We just sit and listen to monotonous lectures without any interactive elements to keep our attention. Based on academic literature, what structured strategies and interactive elements can an instructor introduce to transform passive lecture listening into active cognitive engagement?",
      "The group activities are somewhat engaging, but the long theoretical sections drag on and make me lose focus. Based on the academic corpus, how can theoretical lecture sections be streamlined or punctuated with active learning triggers to maintain high student focus?",
      "The constant use of real-world examples and active discussions keep the whole class completely absorbed! Based on research, how can teachers sustain and scale this high-engagement environment across all course modules?"
    ]
  },

  // Column Q
  "column_q": {
    column: "Q",
    question: "Indicate the number of times your professor uses the following to teach? - Real world examples",
    keys: ["content_s_1", "content_p_1", "real_world_examples", "relevance_2p"],
    prompts: [
      "(Rarely): They almost never use real-world examples, sticking only to textbook theory, which makes the concepts hard to apply. What introductory steps and simple real-world application examples can the instructor integrate into theoretical lectures based on published pedagogical research?",
      "(Sometimes): Real-world examples are used occasionally, which is somewhat helpful but needs to be done more consistently. How can the instructor systematically embed real-world examples into every lesson unit based on the corpus?",
      "(Frequently): They constantly integrate real-world examples into every lesson, making complex topics incredibly easy to grasp and apply! How can an instructor scale student-generated real-world case studies to deepen mastery according to literature?"
    ]
  },

  // Column R
  "column_r": {
    column: "R",
    question: "Indicate the number of times your professor uses the following to teach? - Personal experiences relevant to the topic",
    keys: ["content_s_2", "content_p_2", "personal_experiences"],
    prompts: [
      "(Rarely): The professor almost never shares personal experiences, making the material feel dry and detached from actual reality. How can an instructor start weaving authentic professional or personal experiences into lecture topics based on academic guidelines?",
      "(Sometimes): Occasionally, they share a relevant personal story, which helps clarify the topic but doesn't happen quite often enough. How can an instructor optimize personal story sharing to directly reinforce key learning objectives according to research?",
      "(Frequently): They regularly weave in highly relevant personal experiences, bringing the theory to life and making the learning truly memorable. What strategies exist in published papers to encourage peer personal story sharing while maintaining high academic standards?"
    ]
  },

  // Column S
  "column_s": {
    column: "S",
    question: "Indicate the number of times your professor uses the following to teach? - Material that is directly applicable outside the class",
    keys: ["content_s_3", "content_p_3", "material_applicable", "relevance_1p"],
    prompts: [
      "(Rarely): The material is mostly theoretical and textbook-focused, so I rarely see how to apply these concepts in my future career. What basic steps recommend papers to link theoretical course content with industry tasks and career utility?",
      "(Sometimes): There are occasional connections to the outside world, but a significant portion of the class remains strictly academic. How can an instructor refine theoretical assignments into industry-applicable tasks based on research?",
      "(Frequently): The professor constantly ties every lesson directly to industry practices, making everything we learn immediately useful! How can instructors scale career relevance by partnering with industry experts or live workplace challenges?"
    ]
  },

  // Column T
  "column_t": {
    column: "T",
    question: "Indicate the number of times your professor uses the following to teach? - Current news or updated topics",
    keys: ["content_s_4", "content_p_4", "current_news", "updated_topics"],
    prompts: [
      "(Rarely): The course material feels severely outdated because the professor almost never references current news or recent advancements in the field. How can an instructor easily introduce 5-minute weekly current event breakdowns to modernize course content?",
      "(Sometimes): We occasionally touch on current events, but it feels like an afterthought rather than a core part of the weekly lessons. How can instructors integrate current news directly into core assessment criteria based on educational research?",
      "(Frequently): Every single class session starts with an analysis of current news or newly updated research, making the subject feel incredibly modern and alive. How can instructors sustain this current-news integration efficiently across changing semesters?"
    ]
  },

  // Column U
  "column_u": {
    column: "U",
    question: "Indicate the number of times your professor uses the following to teach? - Real case studies",
    keys: ["content_s_5", "content_p_5", "real_case_studies"],
    prompts: [
      "(Rarely): The professor almost never utilizes real case studies, making it difficult to understand how these theories apply in actual practice. What beginner strategies do papers suggest to introduce short, real-world case studies into traditional lectures?",
      "(Sometimes): We analyze a case study once in a while, which helps, but we need more regular analysis to truly grasp the concepts. How can instructors structure regular mini case-study discussions to build consistent problem-solving skills?",
      "(Frequently): They constantly present detailed, real-world case studies, allowing us to deeply explore actual scenarios and develop practical problem-solving skills. How can instructors facilitate multi-stage case study projects that mirror professional decision-making?"
    ]
  },

  // Column V
  "column_v": {
    column: "V",
    question: "Indicate the number of times your professor uses the following to teach? - Hypothetical case studies",
    keys: ["content_s_6", "content_p_6", "hypothetical_case_studies"],
    prompts: [
      "(Rarely): The professor almost never uses hypothetical case studies, so we rarely get the chance to practice our problem-solving skills in controlled, 'what-if' scenarios. How can teachers create simple hypothetical scenarios to test student understanding during lectures?",
      "(Sometimes): We occasionally work through hypothetical case studies, which is somewhat helpful for testing theories, but they aren't a regular part of the lectures. How can instructors optimize hypothetical case studies to challenge critical thinking consistently?",
      "(Frequently): They frequently introduce complex hypothetical case studies, which constantly challenges us to think critically and apply our knowledge to entirely new and creative situations! How can teachers guide advanced hypothetical simulations to foster innovative student solutions?"
    ]
  },

  // Column W
  "column_w": {
    column: "W",
    question: "Your professor allows the students to share how they relate to the content being taught.",
    keys: ["relevance_1s", "share_relate", "student_perspective"],
    prompts: [
      "(Rarely): The professor almost never lets us share our perspectives, making the lectures feel completely one-sided and disconnected. What introductory prompt techniques can teachers use to invite student personal connections during class?",
      "(Sometimes): We occasionally get to share how we relate to the topics, but usually only if there happens to be extra time at the end. How can instructors build dedicated 3-minute sharing prompts directly into lesson plans?",
      "(Frequently): The professor consistently encourages us to share our personal connections to the material, making the class highly collaborative! How can teachers synthesize student personal insights to enrich overall curriculum delivery?"
    ]
  },

  // Column X
  "column_x": {
    column: "X",
    question: "Professor persuades students to connect the material to their real life.",
    keys: ["relevance_2s", "connect_real_life", "persuades_connect"],
    prompts: [
      "(Rarely): The professor focuses strictly on the textbook and almost never encourages us to see how the material applies to our actual lives. How can an instructor design reflective exit tickets asking students to relate topics to daily life?",
      "(Sometimes): Every now and then they try to help us connect the topics to our own lives, but it is not a consistent focus of the course. What strategies can instructors use to consistently link abstract concepts to everyday student experiences?",
      "(Frequently): They are constantly challenging us to find examples from our daily routines, making the concepts highly relatable and deeply engaging! How can instructors scale daily-life connection exercises into creative student project portfolios?"
    ]
  },

  // Column Y
  "column_y": {
    column: "Y",
    question: "Professor keeps the content entertaining.",
    keys: ["relevance_3s", "content_entertaining", "prof_entertaining"],
    prompts: [
      "(Rarely): The lectures are completely dry and boring, making it almost impossible to stay focused or interested in the content. What dynamic presentation techniques, humor, or media elements do papers recommend to increase lecture enthusiasm?",
      "(Sometimes): The professor occasionally adds a lighthearted comment or dynamic element, but a lot of the lecture time remains pretty dry. How can instructors inject engaging storytelling and interactive media into core course modules?",
      "(Frequently): They bring immense energy, humor, and creative delivery to every single session, making the content incredibly entertaining and fun! How can educators sustain high delivery energy while preserving rigorous academic standards?"
    ]
  },

  // Column Z
  "column_z": {
    column: "Z",
    question: "Professor introduces a controversy through the content.",
    keys: ["relevance_4s", "introduces_controversy", "academic_controversy"],
    prompts: [
      "(Rarely): The professor completely avoids any controversial topics, keeping the content strictly traditional and one-sided, which limits deep intellectual debate. How can an instructor safely introduce structured academic debate on controversial discipline topics?",
      "(Sometimes): They occasionally introduce a controversial viewpoint, which briefly sparks interest, but they don't dive into debates often enough to develop our critical thinking. How can instructors structure devil's advocate exercises to deepen critical thinking?",
      "(Frequently): They regularly introduce fascinating academic controversies and conflicting perspectives, creating an incredible environment for lively debate and rigorous analysis! How can instructors moderate high-level debate to ensure respectful, evidence-based student dialogue?"
    ]
  },

  // Column AA
  "column_aa": {
    column: "AA",
    question: "Your professor uses semi-structured discussion format to teach the materials.",
    keys: ["discuss_1s", "discuss_1p", "semi_structured_discussion"],
    prompts: [
      "(Rarely): The professor relies almost entirely on traditional lectures and rarely organizes semi-structured discussions, leaving students with very few opportunities to exchange ideas or actively explore the concepts being taught. What basic steps transition a traditional lecture to a semi-structured discussion format?",
      "(Sometimes): The professor occasionally incorporates semi-structured discussions into the lessons, allowing students to share opinions and clarify concepts, although these discussions are not a consistent part of the teaching approach. How can instructors structure discussion prompts to ensure high prep and flow?",
      "(Frequently): The professor consistently uses well-planned semi-structured discussions that balance guidance with student participation, helping students analyze concepts collaboratively while remaining focused on the learning objectives. How can teachers scale semi-structured formats to prevent discussion fatigue and maintain momentum?"
    ]
  },

  // Column AB
  "column_ab": {
    column: "AB",
    question: "Professor encourages students to discuss/analyze/debate a given topic/subject.",
    keys: ["discuss_2s", "discuss_2p", "encourage_debate"],
    prompts: [
      "(Rarely): The professor seldom encourages students to discuss, analyze, or debate course topics, making the classroom environment feel passive and limiting opportunities to develop critical thinking skills. How can teachers introduce low-stakes pair debate techniques (e.g., Think-Pair-Share)?",
      "(Sometimes): Students are occasionally invited to discuss or debate important topics, encouraging some level of critical analysis, but these opportunities are not provided regularly throughout the course. How can teachers elevate student debate from basic opinion-sharing to evidence-based analysis?",
      "(Frequently): The professor actively encourages students to analyze different viewpoints, debate ideas respectfully, and justify their opinions, creating an engaging classroom that promotes critical thinking and intellectual curiosity. How can educators publish or highlight outstanding student debate insights to inspire peer excellence?"
    ]
  },

  // Column AC
  "column_ac": {
    column: "AC",
    question: "Professor asks questions to students.",
    keys: ["discuss_3s", "discuss_3p", "asks_questions"],
    prompts: [
      "(Rarely): The professor rarely asks students questions during lectures, resulting in limited interaction and making it difficult for students to remain actively engaged throughout the class. What questioning techniques (e.g. cold calling alternatives, Socratic prompts) stimulate passive classrooms?",
      "(Sometimes): The professor asks questions at certain points during the lecture to check understanding and encourage participation, although questioning is not consistently integrated into every class session. How can instructors upgrade comprehension-check questions into higher-order Bloom's taxonomy questions?",
      "(Frequently): The professor continuously engages students by asking thoughtful and challenging questions throughout the lesson, encouraging participation, checking comprehension, and stimulating deeper thinking. How can teachers train students to ask peer-to-peer challenging questions?"
    ]
  },

  // Column AD
  "column_ad": {
    column: "AD",
    question: "Professor steers discussions so as to bring out innovative and progressive ideas.",
    keys: ["discuss_4s", "discuss_4p", "steers_innovative"],
    prompts: [
      "(Rarely): Discussions rarely move beyond basic textbook concepts because the professor seldom guides conversations toward creative thinking, innovative solutions, or alternative perspectives. How can an instructor guide open discussion toward novel, progressive ideas?",
      "(Sometimes): The professor occasionally redirects discussions toward fresh ideas and different viewpoints, encouraging students to think creatively, although this does not happen consistently. What scaffolding tools help instructors consistently steer discussions toward innovation?",
      "(Frequently): The professor skillfully guides classroom discussions toward innovative and progressive ideas, inspiring students to challenge assumptions, think creatively, and explore multiple perspectives before reaching conclusions. How can teachers turn innovative discussion concepts into actionable student research projects?"
    ]
  },

  // Column AE
  "column_ae": {
    column: "AE",
    question: "Professor designs and structures the discussions in a way that forces analysis and conclusions rather than leaving the topic open-ended.",
    keys: ["discuss_5s", "discuss_5p", "forces_analysis_conclusions"],
    prompts: [
      "(Rarely): Classroom discussions often remain informal and open-ended, with little guidance to help students critically analyze the topic or arrive at meaningful conclusions supported by evidence. How can instructors template discussion summaries to force evidence-backed conclusions?",
      "(Sometimes): The professor occasionally structures discussions to encourage analysis and logical conclusions, helping students organize their thoughts, although many discussions still end without clear outcomes. How can teachers ensure every discussion ends with clear key takeaways and synthesis?",
      "(Frequently): Every discussion is carefully structured to require students to analyze evidence, evaluate different perspectives, and reach well-supported conclusions rather than simply sharing opinions. How can instructors mentor student discussion leaders to enforce analytical conclusions?"
    ]
  },

  // Column AF
  "column_af": {
    column: "AF",
    question: "Professor structures the discussions in ways that ensure/require participation from all students.",
    keys: ["discuss_6s", "discuss_6p", "ensure_participation_all"],
    prompts: [
      "(Rarely): Discussions are usually dominated by a small number of outspoken students because the professor rarely uses strategies that encourage or require participation from everyone. What equitable participation strategies (e.g., round-robin, digital polling) ensure all voices are heard?",
      "(Sometimes): The professor makes occasional efforts to involve quieter students and distribute participation more evenly, although some students still remain passive during discussions. How can teachers design small-group protocols that mandate contribution from every group member?",
      "(Frequently): The professor intentionally designs discussions so that every student has an opportunity and expectation to contribute, creating an inclusive classroom where all voices are valued and heard. How can teachers foster a psychologically safe environment where quieter students thrive?"
    ]
  },

  // Column AG
  "column_ag": {
    column: "AG",
    question: "Creates conditions that push every student to participate in all activities, besides the class discussions.",
    keys: ["act_part_1s", "act_part_1p", "push_all_activities"],
    prompts: [
      "(Rarely): Students are rarely encouraged to actively participate in classroom activities beyond discussions, allowing many to remain passive observers instead of actively engaging with the learning process. What interactive non-discussion activities engage quiet learners?",
      "(Sometimes): The professor occasionally designs activities that encourage broader student involvement, motivating participation beyond discussions, although engagement levels still vary among students. How can educators balance individual exercises, group tasks, and practical workshops in lesson planning?",
      "(Frequently): The professor consistently creates engaging classroom activities that require every student to participate actively, ensuring meaningful involvement through collaborative tasks, exercises, and interactive learning experiences. How can instructors maintain activity momentum while ensuring deep conceptual coverage?"
    ]
  },

  // Column AH
  "column_ah": {
    column: "AH",
    question: "Requires/mandates student participation in class activities.",
    keys: ["act_part_2s", "act_part_2p", "mandates_participation"],
    prompts: [
      "(Rarely): Participation in classroom activities is largely optional, allowing many students to remain disengaged without contributing to the learning process. How can participation rubrics be designed to mandate active contribution without provoking anxiety?",
      "(Sometimes): The professor occasionally requires students to participate in classroom activities, encouraging greater involvement, although participation expectations are not always consistent. How can instructors establish clear, transparent daily participation expectations?",
      "(Frequently): Active participation is expected in nearly every class activity, ensuring that all students remain engaged, contribute to discussions and exercises, and take an active role in their own learning. How can teachers assess qualitative participation fairly across diverse student personality types?"
    ]
  },

  // Column AI
  "column_ai": {
    column: "AI",
    question: "Administers group assignments to class.",
    keys: ["act_part_3s", "act_part_3p", "group_assignments"],
    prompts: [
      "(Rarely): Group assignments are used very infrequently, giving students limited opportunities to collaborate with classmates, exchange ideas, and develop teamwork skills. How can teachers introduce short, low-stakes collaborative group tasks before major projects?",
      "(Sometimes): The professor occasionally assigns collaborative group projects or activities, allowing students to practice teamwork and peer learning, although these assignments are not a regular feature of the course. How can group assignment structures be optimized to prevent free-riding and ensure equal workload distribution?",
      "(Frequently): The professor regularly incorporates group assignments into the course, encouraging students to collaborate, share responsibilities, solve problems collectively, and learn effectively from one another. How can instructors integrate peer evaluation frameworks into frequent group assignments based on research?"
    ]
  },

  // Column AJ
  "column_aj": {
    column: "AJ",
    question: "Involves students in hands-on activities.",
    keys: ["act_part_4s", "act_part_4p", "hands_on_activities"],
    prompts: [
      "(Rarely): The class relies mostly on lectures and theoretical explanations, with very few opportunities for students to participate in practical or hands-on activities that reinforce learning. What simple hands-on exercises or live simulations can be integrated into theoretical subjects?",
      "(Sometimes): Students occasionally engage in practical exercises or hands-on activities that help reinforce classroom concepts, although these experiences could be incorporated more frequently. How can instructors align hands-on lab or workshop exercises directly with weekly exam objectives?",
      "(Frequently): Hands-on learning is a regular part of the course, allowing students to actively apply theoretical concepts through practical activities, experiments, demonstrations, or real-world exercises. How can instructors facilitate student-led hands-on demonstrations and peer technical coaching?"
    ]
  },

  // Column AK
  "column_ak": {
    column: "AK",
    question: "Uses games, simulations etc. that provide opportunities for interaction with other classmates.",
    keys: ["act_part_5s", "act_part_5p", "games_simulations"],
    prompts: [
      "(Rarely): Interactive teaching methods such as games, simulations, or classroom exercises are rarely used, limiting opportunities for students to interact, collaborate, and learn from one another. What lightweight gamification tools (e.g. Quiz games, roleplay simulations) boost classroom interaction?",
      "(Sometimes): The professor occasionally incorporates games, simulations, or other interactive activities that encourage student participation and peer interaction, making some classes more engaging. How can instructional games be designed to reinforce complex technical concepts rather than just surface recall?",
      "(Frequently): The professor frequently uses games, simulations, role-playing activities, and other interactive learning methods that create an energetic classroom environment while promoting collaboration and active participation. How can educators measure the direct learning efficacy of classroom simulations based on research?"
    ]
  },

  // Column AL
  "column_al": {
    column: "AL",
    question: "Has students teach the class.",
    keys: ["act_part_6s", "students_teach_class", "peer_teaching"],
    prompts: [
      "(Rarely): Students are rarely asked to present or teach concepts to their classmates, reducing opportunities to strengthen communication skills and reinforce their own understanding of the material. How can an instructor introduce 'Jigsaw' peer-teaching methods where students present mini-topics?",
      "(Sometimes): The professor occasionally asks students to explain concepts, deliver presentations, or lead small discussions, helping them build confidence and improve their understanding. How can student presentation sessions be scaffolded with feedback rubrics to maximize peer learning?",
      "(Frequently): Students are regularly given opportunities to teach portions of the class through presentations, demonstrations, or peer instruction, strengthening both their mastery of the subject and their communication skills. How can instructors coach student presenters to lead interactive Q&A and active learning exercises?"
    ]
  },

  // Column AM
  "column_am": {
    column: "AM",
    question: "Assigns problem-solving activities to groups.",
    keys: ["act_part_7s", "group_problem_solving", "problem_based_learning"],
    prompts: [
      "(Rarely): Group problem-solving activities are rarely assigned, limiting students' opportunities to collaborate, exchange ideas, and apply classroom concepts to practical challenges. How can problem-based learning (PBL) cases be introduced to groups in standard lecture periods?",
      "(Sometimes): The professor occasionally assigns group problem-solving exercises that encourage teamwork and critical thinking, although these collaborative activities could be incorporated more frequently. How can group problem-solving tasks be structured to require multiple solution pathways and critical trade-off analysis?",
      "(Frequently): The professor consistently assigns challenging group problem-solving activities that require students to analyze complex situations, collaborate effectively, evaluate different solutions, and apply their knowledge to realistic scenarios. How can instructors connect group problem solving with real industry clients or external competitions?"
    ]
  },

  // Column AN
  "column_an": {
    column: "AN",
    question: "Persuades students to be proactive in class.",
    keys: ["act_part_8s", "proactive", "persuades_proactive"],
    prompts: [
      "(Rarely — 1–2): The professor rarely encourages students to take initiative in the classroom, so students are mostly expected to listen and follow instructions rather than independently contribute ideas, ask questions, or take ownership of their learning. Based on academic papers, how can instructors introduce low-stakes opportunities for students to take initiative and be proactive?",
      "(Sometimes — 3–5): The professor occasionally encourages students to be proactive by asking questions, sharing ideas, taking initiative in activities, or becoming more involved in their learning, although this expectation is not consistently reinforced. Based on academic papers, what techniques help transition proactive behaviors from occasional instances to class-wide expectations?",
      "(Frequently — 6–7): The professor consistently motivates students to take initiative, speak up, ask questions, explore ideas independently, and actively contribute to classroom activities, creating a learning environment where students take ownership of their education. Based on academic papers, how can instructors scale student proactivity to foster peer-led discovery and student autonomy?"
    ]
  },

  // Column AO
  "column_ao": {
    column: "AO",
    question: "Percentage use of One-way lectures.",
    keys: ["methods_s_1", "one_way_lectures", "methods_p_1"],
    prompts: [
      "(Low — 0–33%): One-way lectures make up only a small portion of the professor’s teaching approach, so students are frequently exposed to more interactive, collaborative, or activity-based learning methods. How can instructors maintain structure and ensure clear concept delivery when utilizing low-lecture, highly active methods?",
      "(Moderate — 34–66%): One-way lectures account for a substantial portion of the teaching approach, with lectures being balanced by other methods such as discussions, assignments, group work, or practical activities. How can instructors optimize the balance between lecture and interactive learning to ensure both depth and engagement?",
      "(High — 67–100%): One-way lectures dominate the teaching approach, meaning students spend most of their class time listening to instructor-led explanations with comparatively fewer opportunities for interaction or active participation. What structured active learning elements (e.g., lecture pauses, quick writes) can be integrated into high-lecture courses?"
    ]
  },

  // Column AP
  "column_ap": {
    column: "AP",
    question: "Percentage use of Interactive lectures.",
    keys: ["methods_s_2", "interactive_lectures", "methods_p_2"],
    prompts: [
      "(Low — 0–33%): Interactive lectures are used infrequently, so most lecture time involves passive listening rather than questioning, discussion, demonstrations, or other opportunities for students to actively engage with the material. What are the first steps to convert standard lectures into interactive lectures according to research?",
      "(Moderate — 34–66%): Interactive lectures are used regularly enough to provide a balance between instructor explanation and student participation through questions, discussion, demonstrations, or short activities. How can instructors improve the quality and cognitive level of student interactions during lectures?",
      "(High — 67–100%): Interactive lectures are a dominant teaching method, with most lessons actively involving students through questions, discussion, demonstrations, feedback, and frequent opportunities to respond to the material. How can teachers sustain interactive lecture formats across highly technical or dense syllabi?"
    ]
  },

  // Column AQ
  "column_aq": {
    column: "AQ",
    question: "Percentage use of PowerPoint-based one-way lectures.",
    keys: ["methods_s_3", "powerpoint_lectures", "methods_p_3"],
    prompts: [
      "(Low — 0–33%): PowerPoint-based one-way lectures are used only occasionally, so the professor relies relatively little on slide-based, instructor-centered delivery. What alternative media or active presentation styles can replace traditional slide-based delivery effectively?",
      "(Moderate — 34–66%): PowerPoint-based one-way lectures form a moderate portion of the course, providing structured visual explanations while being supplemented by other teaching approaches. How can instructors design slides that support cognitive load theory and avoid bullet-point overload?",
      "(High — 67–100%): PowerPoint-based one-way lectures dominate the course, meaning much of the learning experience depends on instructor-led slide presentations with limited interactive or activity-based instruction. How can instructors transition from 'death by PowerPoint' to slide-supported interactive lectures?"
    ]
  },

  // Column AR
  "column_ar": {
    column: "AR",
    question: "Percentage use of Individual pen-paper assignments.",
    keys: ["methods_s_5", "individual_assignments", "methods_p_5"],
    prompts: [
      "(Low — 0–33%): Individual pen-paper assignments are used infrequently, giving students relatively few opportunities to independently practice concepts through written exercises. What simple individual written exercises can be added to class sessions to reinforce understanding?",
      "(Moderate — 34–66%): Individual pen-paper assignments are used regularly as one component of the course, giving students repeated opportunities to practice and demonstrate individual understanding. How can instructors provide prompt, high-quality feedback on written assignments without excessive grading overhead?",
      "(High — 67–100%): Individual pen-paper assignments make up a large portion of the teaching approach, emphasizing independent written practice, individual problem-solving, and assessment of students’ understanding. How can instructors balance extensive individual written work with interactive or collaborative learning?"
    ]
  },

  // Column AS
  "column_as": {
    column: "AS",
    question: "Percentage use of Interactive/group pen-paper assignments.",
    keys: ["methods_s_6", "group_written_assignments", "methods_p_6"],
    prompts: [
      "(Low — 0–33%): Interactive or group pen-paper assignments are used infrequently, providing limited opportunities for students to collaboratively solve written exercises and exchange ideas. What are simple methods to convert individual pen-paper exercises into small-group collaborative tasks?",
      "(Moderate — 34–66%): Group pen-paper assignments are used with moderate frequency, giving students regular opportunities to collaborate, discuss solutions, and learn from classmates. How can instructors ensure equal participation and grade individual contribution in group written assignments?",
      "(High — 67–100%): Interactive or group pen-paper assignments are a major part of the course, consistently requiring students to work together, exchange reasoning, and collaboratively complete written tasks. How can teachers guide group written tasks to develop high-level synthesis and avoid division of labor without learning?"
    ]
  },

  // Column AT
  "column_at": {
    column: "AT",
    question: "Percentage use of Individual/solo games.",
    keys: ["methods_s_7", "individual_games", "methods_p_7"],
    prompts: [
      "(Low — 0–33%): Individual or solo educational games are rarely used, so students have limited opportunities to learn through independent game-based challenges or interactive exercises. What simple solo games or digital gamified quizzes can be introduced to self-test student knowledge?",
      "(Moderate — 34–66%): Individual games are used periodically to reinforce concepts, provide practice, or make learning more engaging while remaining balanced with conventional methods. How can individual learning games be aligned with core learning outcomes rather than just serving as entertainment?",
      "(High — 67–100%): Individual games are used extensively as a teaching strategy, regularly giving students interactive challenges that encourage independent practice, decision-making, and active learning. How can instructors measure and grade learning outcomes achieved through solo educational games?"
    ]
  },

  // Column AU
  "column_au": {
    column: "AU",
    question: "Percentage use of Interactive/group games.",
    keys: ["methods_s_8", "group_games", "methods_p_8"],
    prompts: [
      "(Low — 0–33%): Interactive or group games are rarely used, providing limited opportunities for students to learn collaboratively through competition, cooperation, or game-based activities. What are simple ways to gamify group reviews or problem-solving sessions?",
      "(Moderate — 34–66%): Group games are used periodically to encourage interaction, teamwork, and active learning, while other teaching methods continue to make up a substantial part of the course. How can instructors design group games that encourage cooperative learning rather than purely competitive focus?",
      "(High — 67–100%): Interactive or group games are a major teaching method, consistently encouraging students to collaborate, communicate, compete or cooperate, and apply course concepts in an engaging environment. How can teachers manage classroom dynamics during high-energy group educational games?"
    ]
  },

  // Column AV
  "column_av": {
    column: "AV",
    question: "Percentage use of Individual/solo online assignments.",
    keys: ["methods_s_9", "individual_online_assignments", "methods_p_9"],
    prompts: [
      "(Low — 0–33%): Individual online assignments are used infrequently, so students have relatively few opportunities to independently practice or demonstrate their understanding through digital tasks. What basic online self-assessments or interactive homework sets can be integrated into the course?",
      "(Moderate — 34–66%): Individual online assignments are used regularly, giving students repeated opportunities to complete independent digital exercises, submit work, and apply course concepts. How can instructors utilize automated grading feedback to guide student learning in online assignments?",
      "(High — 67–100%): Individual online assignments make up a large portion of the teaching approach, emphasizing independent digital practice, online submissions, and self-directed application of course material. How can instructors support students who feel isolated or overwhelmed by heavy solo online workloads?"
    ]
  },

  // Column AW
  "column_aw": {
    column: "AW",
    question: "Percentage use of Interactive/group online assignments.",
    keys: ["methods_s_10", "group_online_assignments", "methods_p_10"],
    prompts: [
      "(Low — 0–33%): Interactive or group online assignments are used infrequently, limiting opportunities for students to collaborate digitally and learn from one another. What tools and methods can introduce lightweight collaborative online homework or wiki editing?",
      "(Moderate — 34–66%): Group online assignments are used with moderate frequency, providing regular opportunities for digital collaboration, peer interaction, and shared problem-solving. How can instructors manage communication hurdles and group dynamics in online collaborative tasks?",
      "(High — 67–100%): Interactive or group online assignments are a major part of the course, consistently requiring students to collaborate online, communicate ideas, divide responsibilities, and jointly complete tasks. What peer feedback systems help ensure fair accountability in major digital group projects?"
    ]
  },

  // Column AX
  "column_ax": {
    column: "AX",
    question: "Percentage use of Individual field assignments.",
    keys: ["methods_s_11", "individual_field_assignments", "methods_p_11"],
    prompts: [
      "(Low — 0–33%): Individual field assignments are rarely used, giving students limited opportunities to apply classroom concepts through independent observation, investigation, or real-world field experience. How can instructors design short, local observation tasks that students can perform independently near home or campus?",
      "(Moderate — 34–66%): Individual field assignments are used periodically, allowing students to connect theoretical learning with independent observations, investigations, or practical experiences outside the classroom. How can field observations be structured to ensure they reinforce specific theoretical lectures?",
      "(High — 67–100%): Individual field assignments are extensively used, making independent real-world investigation and field-based application a major component of the learning experience. How can instructors ensure student safety and consistency in self-directed field studies?"
    ]
  },

  // Column AY
  "column_ay": {
    column: "AY",
    question: "Percentage use of Group field assignments.",
    keys: ["methods_s_12", "group_field_assignments", "methods_p_12"],
    prompts: [
      "(Low — 0–33%): Group field assignments are rarely used, providing limited opportunities for students to collaborate on real-world observations, investigations, or practical fieldwork. What beginner group field tasks can be designed to get students collaborating outside the classroom?",
      "(Moderate — 34–66%): Group field assignments are used regularly enough to provide meaningful opportunities for students to collaborate, investigate real-world situations, and apply course concepts outside the classroom. How can field investigations be integrated into final project requirements?",
      "(High — 67–100%): Group field assignments are a major teaching method, consistently requiring students to work collaboratively on field-based investigations, practical challenges, and real-world applications. How can teams be coached to manage complex logistics during off-campus collaborative fieldwork?"
    ]
  },

  // Column AZ
  "column_az": {
    column: "AZ",
    question: "Percentage use of Fill-in-the-blank notes.",
    keys: ["methods_s_13", "fill_blank_notes", "methods_p_13"],
    prompts: [
      "(Low — 0–33%): Fill-in-the-blank notes are used infrequently, so students have limited reliance on guided note-taking as a way to follow lectures and identify important concepts. What guided note-taking sheets or skeleton outlines can the instructor offer to support student listening?",
      "(Moderate — 34–66%): Fill-in-the-blank notes are used periodically to help students focus on key concepts, complete structured information, and remain attentive during lessons. How can instructors design guided notes that encourage active synthesis rather than just copying words?",
      "(High — 67–100%): Fill-in-the-blank notes are used extensively, making guided note-taking a major component of instruction and regularly directing students toward specific concepts, definitions, and important information. How can teachers phase out fill-in-the-blank notes over the semester to promote independent note-taking skills?"
    ]
  },

  // Column BA
  "column_ba": {
    column: "BA",
    question: "Percentage use of Teaching props/teaching aids, such as replica skulls, real products, or images and videos.",
    keys: ["methods_s_14", "teaching_props", "methods_p_14"],
    prompts: [
      "(Low — 0–33%): Teaching props and visual or physical aids are rarely used, so most instruction depends on verbal explanations, text, or conventional lecture materials. What simple props, physical items, or short demonstration videos can be introduced to make concepts visible?",
      "(Moderate — 34–66%): Teaching props, real products, images, videos, or similar aids are used periodically to clarify concepts and provide students with more concrete or visual learning experiences. How can physical or visual props be actively integrated into student activities rather than just shown?",
      "(High — 67–100%): Teaching aids are used extensively throughout the course, regularly providing students with visual, physical, or real-world representations that make complex concepts easier to understand and remember. How can instructors source or create durable, low-cost physical models and visual aids for active learning?"
    ]
  },

  // Column BB
  "column_bb": {
    column: "BB",
    question: "Percentage use of Articles or cases to read.",
    keys: ["methods_s_15", "articles_read", "methods_p_15"],
    prompts: [
      "(Low — 0–33%): Articles or case materials are rarely assigned, so students have limited opportunities to extend classroom learning through independent reading and analysis of real or documented situations. What introductory case analyses or short articles can be assigned to build reading comprehension?",
      "(Moderate — 34–66%): Articles and case materials are assigned periodically, giving students opportunities to explore topics in greater depth and connect theoretical concepts with practical or documented examples. How can instructors guide student reading using active reading guides or reading checks?",
      "(High — 67–100%): Articles and cases are used extensively, making independent reading and analysis a major component of learning and regularly exposing students to detailed evidence, perspectives, and real-world situations. How can instructors teach student case-cracking methodologies to ensure deep critical analysis?"
    ]
  },

  // Column BC
  "column_bc": {
    column: "BC",
    question: "Percentage use of Any other teaching method.",
    keys: ["methods_s_16", "other_method_1", "methods_p_16"],
    prompts: [
      "(Low — 0–33%): Additional or alternative teaching methods are used infrequently, with the course relying primarily on the standard teaching approaches identified in the survey. What other pedagogy styles (e.g., jigsaw, debate) could be explored to diversify student learning?",
      "(Moderate — 34–66%): Additional teaching methods are used periodically and provide meaningful variation in instruction alongside the professor’s primary teaching approaches. How can instructors evaluate the effectiveness of non-standard teaching methods they introduce?",
      "(High — 67–100%): Additional or alternative teaching methods are used extensively, indicating that the professor relies heavily on diverse instructional approaches beyond the standard methods listed in the survey. How can non-standard methods be aligned with standard departmental assessments?"
    ]
  },

  // Column BD
  "column_bd": {
    column: "BD",
    question: "Any other teaching method — Text.",
    keys: ["methods_s_16_text"],
    prompts: []
  },

  // Column BE
  "column_be": {
    column: "BE",
    question: "Percentage use of Any other teaching method.",
    keys: ["methods_s_17", "other_method_2", "methods_p_17"],
    prompts: [
      "(Low — 0–33%): The additional teaching method represented in this field is used infrequently and has a limited role in the overall instructional approach. What are the best practices for introducing a new supplementary method to students?",
      "(Moderate — 34–66%): The additional teaching method is used with moderate frequency and contributes meaningfully to the variety of instructional experiences provided to students. How can this supplementary method be coordinated with core course lectures?",
      "(High — 67–100%): The additional teaching method is used extensively and represents a substantial component of the professor’s overall teaching approach. How can the instructor ensure that this heavy reliance on an alternative method supports all learning styles?"
    ]
  },

  // Column BF
  "column_bf": {
    column: "BF",
    question: "Any other teaching method — Text.",
    keys: ["methods_s_17_text"],
    prompts: []
  },

  // Column BG
  "column_bg": {
    column: "BG",
    question: "Percentage use of Any other teaching method.",
    keys: ["methods_s_18", "other_method_3", "methods_p_18"],
    prompts: [
      "(Low — 0–33%): The additional teaching method represented in this field is used infrequently and contributes only a small amount to the overall instructional approach. What criteria should guide whether to continue using or discard a low-frequency alternative method?",
      "(Moderate — 34–66%): The additional teaching method is used periodically and provides a meaningful but balanced component of the professor’s overall teaching strategy. How can peer feedback help refine this balanced teaching method?",
      "(High — 67–100%): The additional teaching method is used extensively and plays a major role in how the professor delivers course content and engages students. What evidence-based studies support the extensive use of this non-traditional method?"
    ]
  },

  // Column BH
  "column_bh": {
    column: "BH",
    question: "Any other teaching method — Text.",
    keys: ["methods_s_18_text"],
    prompts: []
  },

  // Column BI
  "column_bi": {
    column: "BI",
    question: "Class materials provided by the professor are well organized.",
    keys: ["cls_org_1s", "cls_org_1p", "materials_organized"],
    prompts: [
      "(Rarely — 1–2): The class materials are often disorganized, difficult to navigate, or inconsistently structured, making it harder for students to locate information, follow the course sequence, and prepare effectively. Based on academic papers, what syllabus and material organization templates (like canvas layout standards) best reduce student cognitive load?",
      "(Sometimes — 3–5): The professor generally provides reasonably organized materials, but some resources may be difficult to locate, inconsistently formatted, or insufficiently structured for easy use. How can instructors systematically catalog resources into weekly modules to improve student navigation according to research?",
      "(Frequently — 6–7): The professor consistently provides well-organized, clearly structured materials that are easy to locate and follow, helping students efficiently review content, prepare for classes, and complete coursework. How can teachers design adaptive learning pathways within well-organized materials to support students at different paces?"
    ]
  },

  // Column BJ
  "column_bj": {
    column: "BJ",
    question: "Your professor outlines his/her expectations clearly to the students early on.",
    keys: ["cls_org_2s", "cls_org_2p", "expectations_clear"],
    prompts: [
      "(Rarely — 1–2): The professor rarely communicates expectations clearly at the beginning of the course, leaving students uncertain about requirements, grading standards, assignments, deadlines, participation, or overall academic responsibilities. What introductory strategies or expectations rubrics help align teacher and student expectations early on?",
      "(Sometimes — 3–5): The professor communicates some expectations early in the course, but certain requirements, standards, deadlines, or participation expectations may remain unclear until the course progresses. How can instructors use mid-term expectation checks or diagnostic rubrics to clarify course standards?",
      "(Frequently — 6–7): The professor clearly explains course expectations early on, including requirements, standards, responsibilities, deadlines, assessment criteria, and participation expectations, giving students a strong understanding of what is expected from the beginning. How can instructors maintain these high expectation standards while supporting student self-efficacy?"
    ]
  },

  // Column BK
  "column_bk": {
    column: "BK",
    question: "Your professor regularly clears up any confusion to avoid frustration from building up.",
    keys: ["cls_org_3s", "cls_org_3p", "clears_confusion"],
    prompts: [
      "(Rarely): The professor almost never stops to check for understanding, leaving us constantly confused and highly frustrated with the coursework. Based on pedagogical research, what formative assessment techniques (e.g. muddiest point cards, thumbs up/down, clicker checks) can quickly gauge student confusion?",
      "(Sometimes): The professor occasionally addresses our questions if we explicitly ask, but there are still times when confusion lingers and frustration builds up. How can instructors proactively check for understanding rather than waiting for students to ask questions?",
      "(Frequently): The professor consistently pauses to check our understanding and proactively clear up any doubts, ensuring no one ever feels lost or frustrated! How can teachers create a classroom culture where sharing confusion is normalized and valued?"
    ]
  },

  // Column BL
  "column_bl": {
    column: "BL",
    question: "Your professor's thoughts are well organized in each session.",
    keys: ["cls_org_4s", "cls_org_4p", "thoughts_organized"],
    prompts: [
      "(Rarely): The professor jumps randomly from topic to topic, making the lectures incredibly disorganized and difficult to follow. What lesson-planning frameworks (e.g., Gagne's Nine Events of Instruction, lesson plans templates) help structure thoughts in a logical order?",
      "(Sometimes): The instructor usually has a basic outline, but occasionally goes off on confusing tangents that disrupt the overall flow of the session. How can instructors use visual signposts or agenda slides to keep lectures on track?",
      "(Frequently): The professor presents every concept in a perfectly structured and logical order, making each session exceptionally clear and easy to comprehend! How can teachers share their mental maps or lecture outlines to help students construct similar mental frameworks?"
    ]
  },

  // Column BM
  "column_bm": {
    column: "BM",
    question: "Notes and other materials provided by the professor are straight-forward, easy to follow.",
    keys: ["cls_org_5s", "cls_org_5p", "notes_straightforward"],
    prompts: [
      "(Rarely): The materials provided by the professor are incredibly convoluted and messy, making it exceptionally difficult to study from them. What are the key design guidelines for creating clear, readable, and structured lecture slides and handouts?",
      "(Sometimes): The instructor provides notes that are mostly helpful, but there are often sections that lack clarity and are somewhat hard to follow. How can instructors optimize the clarity of their notes using headings, summaries, and glossary sections?",
      "(Frequently): The professor consistently provides impeccably clear and straightforward materials, making studying and revision an absolute breeze! How can instructors utilize these materials to support self-regulated study strategies (e.g., retrieval practice)?"
    ]
  },

  // Column BN
  "column_bn": {
    column: "BN",
    question: "Your professor presents unfamiliar material such that students can connect with it.",
    keys: ["challenge_level_1s", "challenge_level_1p", "presents_unfamiliar"],
    prompts: [
      "(Rarely): The professor introduces new concepts without providing any background context, leaving us entirely unable to relate to or grasp the unfamiliar material. What anchoring techniques or KWL charts help connect new information to students' prior knowledge?",
      "(Sometimes): The instructor occasionally tries to bridge the gap when introducing new topics, but the unfamiliar material still frequently feels somewhat disconnected and hard to absorb. How can instructors use comparative and expository organizers to introduce complex, unfamiliar topics?",
      "(Frequently): The professor consistently uses brilliant analogies to introduce new topics, making even the most complex and unfamiliar material incredibly easy to connect with! How can teachers guide students to generate their own analogies to demonstrate deep conceptual mastery?"
    ]
  },

  // Column BO
  "column_bo": {
    column: "BO",
    question: "Students are frequently made to put their knowledge to test.",
    keys: ["challenge_level_2s", "challenge_level_2p", "knowledge_tested"],
    prompts: [
      "(Rarely): The professor almost never gives quizzes or practical assignments, so we rarely get the opportunity to actually test our knowledge of the material. What are low-stakes, high-frequency testing techniques (e.g. weekly retrieval quizzes) that improve long-term retention?",
      "(Sometimes): The instructor occasionally assigns a short quiz or an exercise, but the opportunities to actively put our knowledge to the test are still fairly limited. How can instructors design regular diagnostic self-testing opportunities for students?",
      "(Frequently): The professor consistently challenges us with engaging quizzes and practical exercises, ensuring we constantly put our newly acquired knowledge to the test! How can teachers leverage frequent testing data to adapt their daily instruction in real-time?"
    ]
  },

  // Column BP
  "column_bp": {
    column: "BP",
    question: "Students don't feel overwhelmed with homework and projects at any time of the semester.",
    keys: ["challenge_level_3s", "challenge_level_3p", "homework_overwhelmed"],
    prompts: [
      "(Rarely): The professor assigns an unreasonable amount of homework and projects, leaving us constantly overwhelmed and completely stressed out throughout the entire semester. How can instructors calculate student workload hours accurately using estimation rubrics to prevent cognitive overload?",
      "(Sometimes): The instructor attempts to balance the workload, but there are still several points in the semester where a sudden influx of assignments makes us feel quite overwhelmed. How can instructors coordinate assignment schedules and scaffold large projects to smooth out workload spikes?",
      "(Frequently): The professor paces all assignments and projects perfectly across the syllabus, ensuring the workload is always highly manageable and we never feel overwhelmed! How can teachers share their scheduling strategies to help students develop long-term time management skills?"
    ]
  },

  // Column BQ
  "column_bq": {
    column: "BQ",
    question: "Do the projects and assignments in this class have just enough and optimal level of challenge to keep you motivated to try, and avoid boredom?",
    keys: ["challenge_level_4s", "challenge_level_4p", "optimal_challenge"],
    prompts: [
      "(Rarely): The professor fails to find a good balance in difficulty; the assignments are either mind-numbingly easy or impossibly hard, leaving us either completely bored or totally unmotivated to even try. Based on Flow Theory and Zone of Proximal Development, how can assignments be designed to match student skill levels and avoid both boredom and anxiety?",
      "(Sometimes): The instructor occasionally hits the sweet spot with assignment difficulty, but often the projects lean too far toward being overly tedious or slightly too simple to maintain consistent motivation. How can instructors offer tiered or optional advanced challenges to accommodate varying student skill levels?",
      "(Frequently): The professor perfectly balances the difficulty of every project and assignment, providing the exact optimal level of challenge needed to keep us highly motivated and completely engaged! How can teachers design self-adjusting or choice-based challenges that maintain this optimal engagement over time?"
    ]
  },

  // Column BR
  "column_br": {
    column: "BR",
    question: "How often does your professor know the students by name?",
    keys: ["cncts_1s", "cncts_1p", "know_names"],
    prompts: [
      "(Rarely): The professor almost never takes the time to learn our names, making the classroom feel completely impersonal and anonymous. What practical, low-effort strategies (e.g., name tents, seating charts, photo rosters) help instructors in large classes memorize student names?",
      "(Sometimes): The instructor knows a handful of names, usually just the students who speak up the most, but generally struggles to remember the rest of the class. How can instructors use structured class greetings or daily attendance activities to learn all student names?",
      "(Frequently): The professor makes an incredible effort to memorize every single student's name, creating a wonderfully personalized and welcoming classroom environment! How does knowing students by name affect the 'teacher immediacy' and sense of belonging in the classroom?"
    ]
  },

  // Column BS
  "column_bs": {
    column: "BS",
    question: "How often does your professor take time to know the students personally?",
    keys: ["cncts_2s", "cncts_2p", "know_personally"],
    prompts: [
      "(Rarely): The professor strictly focuses on the academic material and almost never takes the time to learn about our individual interests or personal backgrounds, leaving the dynamic feeling very distant. What are simple ways (e.g., a beginning-of-semester survey) to discover students' interests and backgrounds?",
      "(Sometimes): The instructor occasionally makes small talk before or after class, but building deeper personal connections with students is not a consistent priority. How can instructors integrate brief personal check-ins or interest-based discussion prompts into course time?",
      "(Frequently): The professor actively engages in meaningful conversations about our lives, career goals, and interests outside of class, making everyone feel genuinely valued as an individual! How can teachers maintain professional boundaries while fostering meaningful mentor-student connections?"
    ]
  },

  // Column BT
  "column_bt": {
    column: "BT",
    question: "How often does your professor seem to relate/ connect with the students and their situation?",
    keys: ["cncts_3s", "cncts_3p", "relate_connect"],
    prompts: [
      "(Rarely): The professor seems completely out of touch with the realities of student life, almost never showing any empathy or understanding of our personal situations and challenges. Based on empathy studies in education, how can instructors build flexible course policies (e.g., late-work grace periods) that accommodate student challenges?",
      "(Sometimes): The instructor occasionally acknowledges the pressures we face, but often struggles to genuinely relate to our specific circumstances or connect with us on a deeper level. How can instructors communicate care and understanding during high-stress periods like mid-terms and finals?",
      "(Frequently): The professor demonstrates incredible empathy and understanding, consistently relating to our situations and making us feel truly heard, supported, and valued! How can empathetic teaching be modeled to encourage peer support and mutual respect among students?"
    ]
  },

  // Column BU
  "column_bu": {
    column: "BU",
    question: "How often does your professor keep a friendly attitude towards the students?",
    keys: ["cncts_4s", "cncts_4p", "friendly_attitude"],
    prompts: [
      "(Rarely): The professor maintains a cold and unapproachable demeanor, almost never displaying a friendly attitude, which makes the classroom feel incredibly intimidating and unwelcoming. What verbal and non-verbal immediacy behaviors (e.g., smiling, open posture, warm tone) make a teacher seem more approachable?",
      "(Sometimes): The instructor is generally polite but mostly keeps a strict professional distance, occasionally showing a friendly side but rarely maintaining that warmth consistently. How can instructors inject warmth into standard communications, announcements, and feedback to reduce intimidation?",
      "(Frequently): The professor consistently radiates warmth and positivity, maintaining an incredibly friendly attitude that makes every student feel exceptionally welcome and comfortable! How does a warm classroom climate correlate with student participation and willingness to take academic risks?"
    ]
  },

  // Column BV
  "column_bv": {
    column: "BV",
    question: "How often does your professor engage students outside the classroom?",
    keys: ["cncts_5s", "cncts_5p", "engage_outside"],
    prompts: [
      "(Rarely): The professor strictly limits interactions to lecture time, almost never offering flexible office hours or engaging in academic discussions outside of the formal classroom setting. How can instructors restructure office hours (e.g., virtual drop-ins, group office hours) to make them less intimidating and more accessible?",
      "(Sometimes): The instructor is available during standard office hours, but overall outside engagement remains somewhat limited and strictly tied to specific course questions. How can instructors encourage informal academic chats or advising discussions during their available hours?",
      "(Frequently): The professor actively organizes study groups, attends student events, and consistently engages with us outside the classroom, fostering an incredibly supportive academic community! How does out-of-class communication (OCC) impact student retention and career outcomes?"
    ]
  },

  // Column BW
  "column_bw": {
    column: "BW",
    question: "To what extent is your professor interested in the opinions and feedback of the students?",
    keys: ["cncts_6s", "cncts_6p", "interested_feedback"],
    prompts: [
      "(Rarely): The professor completely ignores our opinions and almost never asks for feedback, making it feel like student voices absolutely do not matter in the classroom. What simple methods (e.g., anonymous exit slips, 1-minute feedback surveys) can start soliciting student input on teaching?",
      "(Sometimes): The instructor occasionally asks for our thoughts or sends out a survey, but it rarely feels like student feedback is consistently used to improve or adjust the course. How can instructors transparently communicate to students how their feedback was used to modify the course?",
      "(Frequently): The professor actively seeks out our opinions and consistently implements our feedback, creating an incredibly collaborative environment where our voices are truly valued! How can instructors co-create certain classroom norms or choice-based assignments with students?"
    ]
  },

  // Column BX
  "column_bx": {
    column: "BX",
    question: "Slide the bar to indicate your teacher's excitement/ energy for the class.",
    keys: ["p_attrib_1", "teacher_excitement", "energy"],
    prompts: [
      "(Rarely): The professor brings almost no energy to the classroom, presenting the material with a flat, monotonous delivery that completely drains our excitement for the subject. Based on studies of teacher enthusiasm, what vocal variation and physical movement techniques can re-energize class delivery?",
      "(Sometimes): The instructor shows occasional bursts of enthusiasm for specific topics, but generally maintains a moderate, subdued energy level throughout the majority of the class. How can instructors tap into their own research or passion areas to bring consistent energy to all syllabus topics?",
      "(Frequently): The professor consistently brings an incredibly high level of energy and infectious excitement to every single session, making the entire class vibrant and thoroughly engaging! How can teacher excitement spark situational interest and long-term intrinsic motivation in students?"
    ]
  },

  // Column BY
  "column_by": {
    column: "BY",
    question: "Slide the bar to indicate how laid back/ relaxed your teacher's attitude towards the class is?",
    keys: ["p_attrib_2", "laid_back", "relaxed_attitude"],
    prompts: [
      "(Rarely): The professor is incredibly rigid and intense, almost never showing a relaxed attitude, which creates an overly stressful and high-pressure classroom environment. How can instructors establish a relaxed and supportive environment without compromising academic standards and control?",
      "(Sometimes): The instructor maintains a mostly strict and formal approach, occasionally adopting a slightly more relaxed demeanor but generally keeping the tone very serious. How can instructors use light humor or informal check-ins to lower student anxiety and build rapport?",
      "(Frequently): The professor consistently brings an incredibly easygoing and laid-back attitude to the classroom, creating a wonderfully comfortable and stress-free space for learning! How does a low-stress, relaxed classroom environment support cognitive processing and memory consolidation?"
    ]
  },

  // Column BZ
  "column_bz": {
    column: "BZ",
    question: "Slide the bar to indicate how much your teacher cares about the student's learning?",
    keys: ["p_attrib_3", "cares_learning"],
    prompts: [
      "(Rarely): The professor seems completely indifferent to whether we grasp the material, rushing through lectures and showing almost no genuine care for actual student learning. What visible behaviors (e.g., offering extra help, pacing adjustments based on confusion) communicate to students that the teacher cares about their learning?",
      "(Sometimes): The instructor occasionally pauses to check our understanding, but frequently seems to prioritize finishing the syllabus over ensuring deep comprehension. How can instructors prioritize key concepts and implement responsive teaching when behind on the syllabus schedule?",
      "(Frequently): The professor demonstrates an incredible dedication to our academic success, constantly going above and beyond to ensure every single student truly masters the material! How does perceived teacher care affect student academic effort and self-efficacy?"
    ]
  },

  // Column CA
  "column_ca": {
    column: "CA",
    question: "Slide the bar to indicate how much your teacher cares about the subject being taught?",
    keys: ["p_attrib_4", "cares_subject"],
    prompts: [
      "(Rarely): The professor shows absolutely no passion for the subject matter, reading directly from the textbook and making the material feel incredibly dull and irrelevant. How can instructors rediscover and project their interest in the subject, especially when teaching introductory or repetitive courses?",
      "(Sometimes): The instructor seems interested in certain parts of the syllabus, but often presents the rest of the subject matter in a fairly routine and uninspired way. How can instructors connect less exciting syllabus topics to wider applications or their own passion projects?",
      "(Frequently): The professor is incredibly passionate about the subject, consistently bringing an infectious enthusiasm that makes every single topic absolutely fascinating to learn about! How does a teacher's passion for the subject influence student major selection and career choices?"
    ]
  },

  // Column CB
  "column_cb": {
    column: "CB",
    question: "How knowledgeable do you think your professor is?",
    keys: ["p_attrib_5", "professor_knowledge"],
    prompts: [
      "(Rarely): The professor rarely demonstrates a deep understanding of the subject, frequently struggling to answer basic questions and heavily relying on the textbook to get through the lecture. What strategies can instructors use to prepare for advanced student questions and manage areas where their own knowledge is still developing?",
      "(Sometimes): The instructor sometimes displays a good grasp of the core concepts, but occasionally fumbles when students ask more complex questions that go slightly beyond the immediate lesson plan. How can instructors construct a safe 'I don't know, let's find out' culture that models scientific inquiry?",
      "(Frequently): The professor consistently demonstrates an incredibly deep mastery of the field, effortlessly answering complex questions and providing brilliant, real-world insights into the subject! How can highly knowledgeable professors translate their expertise without overwhelming novice learners?"
    ]
  },

  // Column CC
  "column_cc": {
    column: "CC",
    question: "How easy it is to approach your professor if you need?",
    keys: ["p_attrib_6", "easy_approach"],
    prompts: [
      "(Rarely): The professor is incredibly intimidating and almost never available, making it exceptionally difficult to approach the instructor for help when needed. What specific behaviors or policies (e.g., welcoming office hours announcements, approachable tone) break down barriers to teacher approachability?",
      "(Sometimes): The instructor is generally polite but often seems too busy, meaning students sometimes feel slightly hesitant to approach the professor with questions. How can instructors intentionally carve out dedicated 'before/after class' minutes to be visibly available and unhurried?",
      "(Frequently): The professor consistently maintains an incredibly welcoming and open demeanor, making it exceptionally easy to approach the instructor with any question or concern! How does teacher approachability correlate with student help-seeking behaviors and academic performance?"
    ]
  },

  // Column CD
  "column_cd": {
    column: "CD",
    question: "To what extent does your professor lets her/his personality reflect in the interactions?",
    keys: ["p_attrib_7", "personality_reflect"],
    prompts: [
      "(Rarely): The professor maintains a strictly formal and completely robotic demeanor, almost never letting their true personality shine through, which makes all of our interactions feel incredibly impersonal. How can instructors safely reveal aspects of their personality or professional journey to build authenticity in the classroom?",
      "(Sometimes): The instructor occasionally shows a bit of personal flair or humor, but mostly sticks to a standard, highly professional script during the majority of our interactions. How can instructors use authenticity and storytelling to connect abstract concepts to human experiences?",
      "(Frequently): The professor consistently brings their authentic self to the classroom, letting their vibrant personality shine through in every single interaction and making the course incredibly engaging! How does teacher authenticity and self-disclosure impact student engagement and class community?"
    ]
  },

  // Column CE
  "column_ce": {
    column: "CE",
    question: "How high is your teacher's sense of humor?",
    keys: ["p_attrib_8", "sense_humor"],
    prompts: [
      "(Rarely): The professor is incredibly serious and almost never uses humor, keeping the classroom atmosphere strictly formal and often quite dry. How can instructors introduce lighthearted or content-related humor to reduce tension and make the content more memorable?",
      "(Sometimes): The instructor occasionally cracks a joke or lightens the mood, but mostly maintains a straightforward, academic approach to the lectures. How can humor be integrated systematically into visual slides or review activities without distracting from learning?",
      "(Frequently): The professor consistently incorporates an incredible sense of humor into the lessons, keeping the classroom lively, highly entertaining, and often filled with laughter! What is the difference between instructionally relevant humor that supports learning and inappropriate or distracting humor?"
    ]
  },

  // Column CF
  "column_cf": {
    column: "CF",
    question: "How often does your teacher uses humor, makes fun of, or laugh at oneself?",
    keys: ["p_attrib_9", "use_humor", "laugh_oneself"],
    prompts: [
      "(Rarely): The professor takes everything extremely seriously and almost never uses self-deprecating humor or laughs at oneself, maintaining an unyielding aura of perfection. How can instructors use self-deprecating humor or humility to normalize mistakes as a natural part of the learning process?",
      "(Sometimes): The instructor occasionally makes a lighthearted remark or chuckles at a personal mistake, but generally prefers to keep the focus strictly on the lesson. How can acknowledging small teaching errors or tech failures build mutual trust with students?",
      "(Frequently): The professor regularly uses delightful self-deprecating humor and easily laughs at oneself, creating a wonderfully humble, relaxed, and deeply relatable classroom atmosphere! How does a teacher's vulnerability and willingness to laugh at oneself lower the affective filter for student participation?"
    ]
  }
};

/**
 * Fallback prompt generator for any feature or variable name NOT explicitly present in Columns A–CF
 */
export function generateFallbackPrompts(varName) {
  const cleanName = String(varName || "Selected Feature").replace(/_/g, ' ').trim();
  return [
    `Low evaluation scores were observed for '${cleanName}'. Based on academic literature in higher education and pedagogical design, what are the primary root causes for low student response on this variable, and what basic starting steps should the instructor implement to address this deficit?`,
    `Analyzing student feedback on '${cleanName}': What specific instructional interventions, active learning exercises, or structural curriculum adjustments do published research papers recommend to optimize student outcomes and satisfaction in this area?`,
    `To achieve high pedagogical standards for '${cleanName}', what evidence-based strategies, coaching models, and evaluation frameworks can an instructor deploy to scale and sustain performance in future course offerings?`
  ];
}

/**
 * Retrieve prompt details for any variable name, column letter, or question title.
 * Returns an object with question title, column letter, prompt text, and selected index.
 */
export function getRandomPromptForVariable(variableIdentifier, options = {}) {
  if (!variableIdentifier) {
    return {
      variable: "General Evaluation",
      question: "Overall Course Evaluation",
      column: "General",
      prompt: generateFallbackPrompts("General Evaluation")[0],
      promptIndex: 0
    };
  }

  const rawKey = String(variableIdentifier).toLowerCase().trim();
  const cleanKey = rawKey.replace(/_/g, '');

  let matchedEntry = null;

  // 1. Direct match by Column Object Key (e.g., "column_q", "column_aa", "column_cf")
  if (COLUMN_PROMPTS[rawKey]) {
    matchedEntry = COLUMN_PROMPTS[rawKey];
  }

  // 2. Match by Column Letter (e.g. "Q", "AA", "CF")
  if (!matchedEntry) {
    for (const item of Object.values(COLUMN_PROMPTS)) {
      if (item.column.toLowerCase() === rawKey) {
        matchedEntry = item;
        break;
      }
    }
  }

  // 3. Match by keys array or question title
  if (!matchedEntry) {
    for (const item of Object.values(COLUMN_PROMPTS)) {
      const keyMatch = item.keys.some((k) => {
        const kLow = k.toLowerCase();
        const kClean = kLow.replace(/_/g, '');
        // Exact raw match (e.g. "content_s_1" === "content_s_1")
        if (kLow === rawKey) return true;
        // Cleaned-string exact match (e.g. "contents1" === "contents1")
        if (kClean === cleanKey) return true;
        // Partial cleaned match — key starts with the search term (prefix match)
        if (kClean.startsWith(cleanKey) || cleanKey.startsWith(kClean)) return true;
        return false;
      });
      const titleMatch =
        item.question.toLowerCase().includes(rawKey) ||
        rawKey.includes(item.question.toLowerCase().substring(0, 20));
      if (keyMatch || titleMatch) {
        matchedEntry = item;
        break;
      }
    }
  }

  // Extract prompts list
  let availablePrompts = [];
  let questionTitle = String(variableIdentifier).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let columnLetter = "Custom";

  if (matchedEntry && matchedEntry.prompts && matchedEntry.prompts.length > 0) {
    availablePrompts = matchedEntry.prompts;
    questionTitle = matchedEntry.question;
    columnLetter = matchedEntry.column;
  } else {
    // If caller wants null when no exact match is found (e.g. for fallback chaining)
    if (options.returnNullOnNoMatch) return null;
    availablePrompts = generateFallbackPrompts(variableIdentifier);
  }

  // Clamp promptIndex to valid range
  let chosenIndex = 0;
  if (typeof options.promptIndex === 'number' && options.promptIndex >= 0 && options.promptIndex < availablePrompts.length) {
    chosenIndex = options.promptIndex;
  } else if (typeof options.promptIndex === 'number') {
    // If requested index is out of range (e.g. index 2 but only 1 prompt), clamp to last
    chosenIndex = Math.min(Math.max(0, options.promptIndex), availablePrompts.length - 1);
  } else {
    chosenIndex = Math.floor(Math.random() * availablePrompts.length);
  }

  const chosenPrompt = availablePrompts[chosenIndex];

  return {
    variable: variableIdentifier,
    question: questionTitle,
    column: columnLetter,
    prompt: chosenPrompt,
    promptIndex: chosenIndex + 1,
    allPrompts: availablePrompts
  };
}
