import _ from 'lodash';

const localDB = (() => {
    /*
     -> Each id is item. And each item is comes in url path in frontend. Maintaining 1 level hierarchy in DB is important.
     -> This DB will be indexed using id for faster search.
     -> Only parent id needs to change in case folder/file is moved to another hierarchy.
     -> type:file will be restricted to have any children.
     */
    const questsCollection = [
        {
            id: 12323,
            text: 'Before Akshay Kumar became an actor, he worked as a...?',
            options: [
                {id:1, text: 'Clerk'},
                {id:5, text: 'Reporter'},
                {id:3, text: 'Waiter'},
                {id:4, text: 'Journalst'},
                {id:5, text: 'model'}
            ],
            truth: 3 // id of answer
        },
        {
            id: 5323,
            text: 'Which of these actors has never appeared in television advertisements?',
            options: [
                {id:1, text: 'Govinda'},
                {id:2, text: 'Hrithik Roshan'},
                {id:3, text: 'Shah Rukh Khan'},
                {id:4, text: 'Anil Kapoor'},
                {id:5, text: 'Sanjay Dutt'}
            ],
            truth: 4 // id of answer
        },
        {
            id: 1563,
            text: ' From where does Veeru propose to Basanti in Sholay?',
            options: [
                {id:1, text: 'Top of a roof'},
                {id:2, text: 'Top of a ladder'},
                {id:3, text: 'Top of a hill'},
                {id:4, text: 'Top of a water tank'},
                {id:5, text: 'Top of a tree'}
            ],
            truth: 4 // id of answer
        },
        {
            id: 87746,
            text: 'Which actor played role in movie Raees?',
            options: [
                {id:1, text: 'Karan Johar'},
                {id:2, text: 'Shah Rukh Khan'},
                {id:3, text: 'Parmeet Sethi'},
                {id:4, text: 'Anupam Kher'},
            ],
            truth: 2 // id of answer
        },
        {
            id: 99243,
            text: 'Why did Katappa killed Bahubali?',
            options: [
                {id:1, text: 'Nobody knows'},
                {id:2, text: 'Katappa had mood swings'},
            ],
            truth: 1 // id of answer
        },
    ];

    /* Parse questsCollection with questId */
    const _getItemDetailsById = (questId, selectedOptId) => {
        let isCorrect =  false;

        let questReq = null;
        for (const qId in questsCollection) {
            if (questsCollection[qId].id == questId) {
                questReq = {};
                questReq.text = questsCollection[qId].text;
                questsCollection[qId].options.forEach((opt)=> {
                    if (opt.id == questsCollection[qId].truth) {
                        questReq.answer = opt.text;
                        isCorrect = selectedOptId === opt.id ? true : false;
                    }
                });
                break;
            }
        }
        if (!questReq) {
            return null;
        }
        return { res: questReq, isCorrect};
    };

    return {
        /* only for type: folder */
        getQuestionList: () => {
            let data = null;
            data = questsCollection;
            if (data) {
                data.forEach((quest, id)=> {
                    quest = _.omit(quest, ['truth']);
                });
            } else {
                return {success: false, reason: 'Invalid Folder Requested' };
            }

            const response = {
                data,
                success: true
            };
            return response;
        },

        checkAnswers: (questsAttempted) => {
            //For each id prepare
            const data = [];
            let totalCorrect = 0;
            var a = [
                {
                    txt: 'question',
                    truth: 'actual answer',
                    opt: 'selected text'
                }
            ];
            for (const questId in questsAttempted) {
                if (questsAttempted.hasOwnProperty(questId)) {
                    let questRes = {};
                    const questAns = _getItemDetailsById(questId, questsAttempted[questId].optId);
                    questRes =  questAns.res;

                    if (questAns.isCorrect) {
                        totalCorrect++;
                    }
                    questRes.userAns = questsAttempted[questId].optText;
                    data.push(questRes);
                }
            }

            console.log("DATA", data);
            const response = {
                result: {
                    data,
                    totalCorrect
                },
                success: true
            };
            return response;
        }
    };
})();


export default localDB;
