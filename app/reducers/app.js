import localDB from './modules/localDb';

// ACTIONS
const FETCH_LIST = 'FETCH_LIST';
const CHECK_ANSWER = 'CHECK_ANSWER';
const USER_DETAILS = 'USER_DETAILS';


// REDUCER
const initialState = {
};

const app = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LIST:
            return {
                ...state,
                result: action.result.success ? action.result.data : null,
                success: action.result.success
            };

        case CHECK_ANSWER:
            return {
                ...state,
                result: action.result.success ? action.result.result.data : null,
                totalCorrect: action.result.success ? action.result.result.totalCorrect : null,
                success: action.result.success
            };

        case USER_DETAILS:
            return {
                ...state,
                userName: action.userName
            };

        default:
            return state;
    }
};

// DISPATCHERS
export function getQuestionsList() {
    // add middleware later to support mapping with promise and actions
    const result = localDB.getQuestionList();
    console.log('............GET QUESTION LIST.............');
    console.log(result);

    return {
        type: FETCH_LIST,
        result
    };
}

export function checkAnswers(questsAttempted) {
    // add middleware later to support mapping with promise and actions
    const result = localDB.checkAnswers(questsAttempted);
    console.log('............CHECK ANSWER.............');
    console.log(result);

    return {
        type: CHECK_ANSWER,
        result
    };
}

export function updateUserDetails(userName) {
    // add middleware later to support mapping with promise and actions
    return {
        type: USER_DETAILS,
        userName
    };
}

export default app;
