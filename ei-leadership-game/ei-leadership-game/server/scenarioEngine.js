const fs = require('fs');
const path = require('path');

class ScenarioEngine {
  constructor() {
    this.scenarios = this.loadScenarios();
  }

  // Load scenarios from JSON file
  loadScenarios() {
    try {
      const scenariosPath = path.join(__dirname, '../data/scenarios.json');
      const data = fs.readFileSync(scenariosPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      // Return default scenarios if file doesn't exist
      return this.getDefaultScenarios();
    }
  }

  // Get scenarios for a game (can be randomized or selected)
  getScenarios(count = 6) {
    // Shuffle and select scenarios
    const shuffled = [...this.scenarios].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Get default scenarios (fallback)
  getDefaultScenarios() {
    return [
      {
        id: 'scenario-1',
        category: 'Performance Management',
        context: 'You notice a usually high-performing team member has been missing deadlines and seems disengaged in meetings over the past two weeks.',
        challenge: 'How do you address this situation?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Schedule a private one-on-one to understand what\'s happening in their life',
            scores: {
              empathy: 3,
              selfAwareness: 1
            }
          },
          {
            id: 'B',
            text: 'Send a firm email reminding them of performance expectations',
            scores: {
              selfRegulation: 1,
              socialSkills: -1
            }
          },
          {
            id: 'C',
            text: 'Ignore it for now; everyone has off weeks',
            scores: {
              selfAwareness: -2,
              empathy: -1
            }
          },
          {
            id: 'D',
            text: 'Ask the team in a meeting if anyone is struggling with workload',
            scores: {
              empathy: 1,
              socialSkills: 2
            }
          },
          {
            id: 'E',
            text: 'Reflect on whether your leadership style might be contributing to the issue',
            scores: {
              selfAwareness: 3,
              empathy: 2
            }
          }
        ],
        discussionPrompts: [
          'What information would you want to gather before taking action?',
          'How might your own emotional state influence your response?',
          'What are the risks and benefits of each approach?'
        ],
        learningPoints: [
          'Empathy requires active listening and understanding context',
          'Self-awareness helps leaders recognize their impact on others',
          'Timing and privacy matter in sensitive conversations'
        ]
      },
      {
        id: 'scenario-2',
        category: 'Conflict Resolution',
        context: 'During a strategy meeting, two senior team members begin arguing intensely about the project direction. The tension is affecting the whole team.',
        challenge: 'As the leader, what do you do in the moment?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Let them work it out; healthy debate is good',
            scores: {
              selfRegulation: -1,
              socialSkills: -2
            }
          },
          {
            id: 'B',
            text: 'Take a break and speak with each person individually',
            scores: {
              selfRegulation: 3,
              empathy: 2
            }
          },
          {
            id: 'C',
            text: 'Firmly tell them to stop and move on',
            scores: {
              selfRegulation: 1,
              socialSkills: -1
            }
          },
          {
            id: 'D',
            text: 'Acknowledge both perspectives and redirect to common goals',
            scores: {
              socialSkills: 3,
              empathy: 2,
              selfRegulation: 2
            }
          },
          {
            id: 'E',
            text: 'Join the debate to add your perspective',
            scores: {
              selfAwareness: -1,
              socialSkills: -1
            }
          }
        ],
        discussionPrompts: [
          'How do you manage your own emotions when conflict arises?',
          'What signals indicate when debate becomes destructive?',
          'How can conflict be productive for teams?'
        ],
        learningPoints: [
          'Self-regulation helps leaders stay calm under pressure',
          'Social skills enable constructive conflict resolution',
          'Empathy helps understand underlying concerns'
        ]
      },
      {
        id: 'scenario-3',
        category: 'Strategic Decisions',
        context: 'You must choose between two qualified candidates for a promotion. One is technically stronger but struggles with collaboration. The other is a team player but needs technical development.',
        challenge: 'How do you make this decision?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Choose the technical expert; skills matter most',
            scores: {
              motivation: 1,
              selfAwareness: -1
            }
          },
          {
            id: 'B',
            text: 'Choose the team player; culture fit is critical',
            scores: {
              empathy: 2,
              socialSkills: 2
            }
          },
          {
            id: 'C',
            text: 'Create a development plan for both and delay the decision',
            scores: {
              selfRegulation: 2,
              motivation: 2
            }
          },
          {
            id: 'D',
            text: 'Ask the team for input on who they\'d prefer',
            scores: {
              socialSkills: 2,
              empathy: 1
            }
          },
          {
            id: 'E',
            text: 'Reflect on what the role truly requires and your own biases',
            scores: {
              selfAwareness: 3,
              selfRegulation: 2
            }
          }
        ],
        discussionPrompts: [
          'What factors should weigh most heavily in promotion decisions?',
          'How do personal biases influence leadership choices?',
          'What\'s the role of emotional intelligence in this decision?'
        ],
        learningPoints: [
          'Self-awareness helps identify personal biases',
          'Different roles require different EI competencies',
          'Development potential matters as much as current skills'
        ]
      },
      {
        id: 'scenario-4',
        category: 'Change Management',
        context: 'Your organization is implementing a major restructuring that will affect your team. You have concerns about the plan but must communicate it to your team tomorrow.',
        challenge: 'How do you prepare and deliver this message?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Present it positively, hiding your own concerns',
            scores: {
              selfAwareness: -1,
              empathy: -1
            }
          },
          {
            id: 'B',
            text: 'Share your concerns openly and invite team input',
            scores: {
              selfAwareness: 2,
              empathy: 2,
              socialSkills: 2
            }
          },
          {
            id: 'C',
            text: 'Deliver the facts without emotion or opinion',
            scores: {
              selfRegulation: 1,
              empathy: -1
            }
          },
          {
            id: 'D',
            text: 'Acknowledge the difficulty while emphasizing opportunities',
            scores: {
              empathy: 3,
              motivation: 2,
              socialSkills: 2
            }
          },
          {
            id: 'E',
            text: 'Focus on what you can control and commit to supporting the team',
            scores: {
              selfRegulation: 3,
              motivation: 2,
              empathy: 1
            }
          }
        ],
        discussionPrompts: [
          'How do you balance authenticity with organizational loyalty?',
          'What role does emotional honesty play in change management?',
          'How can leaders maintain team morale during uncertainty?'
        ],
        learningPoints: [
          'Authentic leadership builds trust during change',
          'Self-regulation helps manage personal anxiety',
          'Empathy acknowledges team concerns while moving forward'
        ]
      },
      {
        id: 'scenario-5',
        category: 'Team Development',
        context: 'A team member comes to you frustrated because they feel their ideas are consistently ignored in team meetings. You\'ve noticed they tend to present ideas at the wrong time or without sufficient context.',
        challenge: 'How do you coach this person?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Tell them directly what they\'re doing wrong',
            scores: {
              selfAwareness: 1,
              empathy: -1
            }
          },
          {
            id: 'B',
            text: 'Ask them to describe what happens from their perspective',
            scores: {
              empathy: 3,
              socialSkills: 2
            }
          },
          {
            id: 'C',
            text: 'Suggest they be more assertive in meetings',
            scores: {
              empathy: -1,
              socialSkills: 1
            }
          },
          {
            id: 'D',
            text: 'Share your observations and work together on strategies',
            scores: {
              empathy: 2,
              socialSkills: 3,
              selfAwareness: 2
            }
          },
          {
            id: 'E',
            text: 'Commit to creating more space for their input in meetings',
            scores: {
              empathy: 2,
              socialSkills: 2,
              selfRegulation: 1
            }
          }
        ],
        discussionPrompts: [
          'How do you give feedback that\'s both honest and supportive?',
          'What\'s the difference between empathy and agreement?',
          'How can leaders help team members develop self-awareness?'
        ],
        learningPoints: [
          'Effective coaching starts with understanding the other person\'s perspective',
          'Social skills include helping others develop their own capabilities',
          'Self-awareness in leaders helps them give better feedback'
        ]
      },
      {
        id: 'scenario-6',
        category: 'Performance Management',
        context: 'You receive feedback that your high standards and attention to detail are creating stress for your team. However, these standards have led to excellent results and client satisfaction.',
        challenge: 'How do you respond to this feedback?',
        timeLimit: 90,
        options: [
          {
            id: 'A',
            text: 'Maintain your standards; results speak for themselves',
            scores: {
              selfAwareness: -2,
              empathy: -2
            }
          },
          {
            id: 'B',
            text: 'Immediately lower your expectations to reduce stress',
            scores: {
              selfRegulation: -1,
              motivation: -1
            }
          },
          {
            id: 'C',
            text: 'Reflect on how your behavior impacts the team and seek to understand their experience',
            scores: {
              selfAwareness: 3,
              empathy: 3
            }
          },
          {
            id: 'D',
            text: 'Discuss with the team how to maintain quality while managing workload',
            scores: {
              empathy: 2,
              socialSkills: 3,
              selfAwareness: 2
            }
          },
          {
            id: 'E',
            text: 'Examine which standards are essential and which might be your personal preferences',
            scores: {
              selfAwareness: 3,
              selfRegulation: 2,
              empathy: 1
            }
          }
        ],
        discussionPrompts: [
          'How do you balance high standards with team wellbeing?',
          'What role does self-awareness play in receiving feedback?',
          'How can leaders distinguish between essential standards and personal preferences?'
        ],
        learningPoints: [
          'Self-awareness includes understanding how your strengths can become weaknesses',
          'Empathy means considering the impact of your actions on others',
          'Effective leaders adapt their approach based on team needs'
        ]
      }
    ];
  }
}

module.exports = ScenarioEngine;

// Made with Bob
