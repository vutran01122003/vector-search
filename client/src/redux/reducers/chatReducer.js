import { globalTypes } from '../actions/globalTypes';

const initialState = {
    question: '',
    answer: '',
    history: []
};

function chatReducer(state = initialState, action) {
    switch (action.type) {
        case globalTypes.CHAT.SEND_QUESTION:
            return {
                ...state,
                question: action.payload.question
            };
        default:
            return state;
    }
}

export default chatReducer;
