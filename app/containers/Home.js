import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import Link from 'react-router/lib/Link';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { getQuestionsList, checkAnswers, updateUserDetails } from '../reducers/app';
import Modal from '../components/Library/Modal';

import styles from '../styles/Home.scss';
import libStyles from '../styles/library.scss';

@connect(
    state => ({
        userName: state.app.userName,
        result: state.app.result,
        success: state.app.success,
        totalCorrect: state.app.totalCorrect
    }),
    dispatch => bindActionCreators({getQuestionsList, checkAnswers, updateUserDetails}, dispatch)
)

export default class Home extends Component {
    static propTypes = {
        getQuestionsList: PropTypes.func,
        checkAnswers: PropTypes.func,

        updateUserDetails: PropTypes.func,
        userName: PropTypes.string,

        result: PropTypes.array,
        success: PropTypes.bool,
        totalCorrect: PropTypes.number,
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedItems: {},
            displayQuestContent: null,
            displayTimer: null,
            crntQuestIndex: 0,
            questsAttempted: {}
        };

        this.handleSubmitAns = this.handleSubmitAns.bind(this);
        this.handleUserDetails = this.handleUserDetails.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        this.addRipple = this.addRipple.bind(this);

        this.timer = {};
        this.limitTimer = 1;
        this.limitQuests = 5;
    }

    componentDidMount() {
        if (!this.props.userName) {
            this.setState({isPopUpOpen: true, displayQuestContent: false, displayTimer: false});
        } else {
            this.setState({isPopUpOpen: false});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.displayTimer && this.state.displayTimer) {
            this.timer.count = this.limitTimer;
            this.props.getQuestionsList();
            if (this.refs.timer) {
                this.refs.timer.innerText = this.timer.count;
                this.timer.count--;

                this.timer.interval = setInterval(()=> {
                    this.refs.timer.innerText = this.timer.count;
                    if (!this.timer.count || this.timer.count < 0) {
                        clearInterval(this.timer.interval);
                        this.setState({displayTimer: false, displayQuestContent: true});
                    }
                    this.timer.count-- ;
                }, 1000);
            }
        }

        if (prevState.questsAttempted && this.state.questsAttempted &&
            Object.keys(prevState.questsAttempted).length !== Object.keys(this.state.questsAttempted).length &&
            Object.keys(this.state.questsAttempted).length === this.limitQuests) {
                // Checking all answers
                this.props.checkAnswers(this.state.questsAttempted);
        }

        if (this.props.totalCorrect && this.refs.progress) {
            const percentage = (this.props.totalCorrect / this.limitQuests)*100;
            setTimeout(()=> {this.refs.progress.style.width = percentage + '%';}, 200);
        }
    }

    handleSubmitAns(questId, optId, optText) {
        const newQuestsAttempted = Object.assign({}, this.state.questsAttempted);
        newQuestsAttempted[questId] = {
            optId,
            optText
        };
        let curQuestInd = this.state.crntQuestIndex;

        if (curQuestInd >= this.limitQuests - 1) {
            this.setState({
                displayQuestContent: false
            });
        } else {
            curQuestInd++;
        }
        this.setState({
            crntQuestIndex: curQuestInd,
            questsAttempted: newQuestsAttempted
        });
    }

    closePopUp() {
        this.setState({
            isPopUpOpen: false
        });
    }

    addRipple(e) {
            console.log("ADDING RIPPLE??????????");
            const rippleBtn = e.currentTarget;

            // Remove any old
            if (document.getElementById('js-ripple')) {
                console.log("REMOVE....");
                document.getElementById('js-ripple').remove();
            }

            // Setup
            console.log("RIPPLE...BTN");
            console.dir(rippleBtn);
            let posX = rippleBtn.offsetLeft;
            let posY = rippleBtn.offsetTop;
            let buttonWidth = rippleBtn.offsetWidth;
            let buttonHeight =  rippleBtn.offsetHeight;


            // Add the element

            const ripple = document.createElement("span");
            ripple.className = libStyles.ripple;
            ripple.id = 'js-ripple';
            rippleBtn.prepend(ripple);


            // Make it round!
            if(buttonWidth >= buttonHeight) {
                buttonHeight = buttonWidth;
            } else {
                buttonWidth = buttonHeight;
            }

            // Get the center of the element
            let x = e.pageX - posX - buttonWidth / 2;
            let y = e.pageY - posY - buttonHeight / 2;


            // Add the ripples CSS and start the animation
            document.getElementById('js-ripple').style.width = buttonWidth + 'px';
            document.getElementById('js-ripple').style.height = buttonHeight + 'px';
            document.getElementById('js-ripple').style.top = y + 'px';
            document.getElementById('js-ripple').style.left =  x + 'px';

            document.getElementById('js-ripple').classList.add(libStyles.rippleEffect);
    }

    handleUserDetails(userName) {
        const selectedItemId = Object.keys(this.state.selectedItems)[0];
        this.props.updateUserDetails(userName);
        this.setState({displayTimer: true});
    }

    renderQuestion() {
        if (!this.state.displayQuestContent || !this.props.result) {
            return null;
        }

        const newQues = this.props.result[this.state.crntQuestIndex];
        if (!newQues) {
            return null;
        }
        const newOptList = [];

        newQues.options.forEach((option, ind)=> {
            newOptList.push(
                <li className={styles.questionListItem}
                    key={ind}>
                    <div className={styles.rippleBtn}
                         onClick={(e) => {
                             e.stopPropagation();
                             e.nativeEvent.stopImmediatePropagation();
                             this.addRipple(e);
                             setTimeout(()=>{
                                 this.handleSubmitAns(newQues.id, option.id, option.text);
                             }, 600);

                         }}>
                        <span className={styles.btn + ' ' +libStyles.customAppear}>
                            {option.text}
                        </span>
                    </div>
                </li>
            );
        });

        const crntQuestion = (
            <div className={styles.questionContainer}>
                <div className={styles.questionText}>
                    <span className={styles.subText}>{this.state.crntQuestIndex + 1}.</span>
                    {newQues.text}
                </div>
                <ul className={styles.questionList}>
                    {newOptList}
                </ul>
            </div>
        );

        return crntQuestion;
    }

    renderWelcomeMsg() {
        if(this.props.userName) {
            return (
                <div className={styles.title}>
                    Hi <span className={styles.userName}>{this.props.userName},</span>
                </div>
            );
        }
        return null;
    }

    renderTimer() {
        if (this.props.userName && this.state.displayTimer) {
            return (
                <div className={styles.timer}>
                    <span className={styles.timerText} ref="timer"></span>
                </div>
            );
        }

        return null;
    }

    renderPostQuestion() {
        if (this.props.userName && !this.state.displayTimer && !this.state.displayQuestContent &&
            this.props.result && this.props.totalCorrect) {

            const resultQuestList = [];
            this.props.result.forEach((quest, ind)=>{
                const customClass = quest.answer.trim().toLowerCase() === quest.userAns.trim().toLowerCase() ? styles.correct : styles.incorrect;

                resultQuestList.push(
                    <li className={styles.listItem} key={ind}>
                        <div className={styles.label + ' ' + styles.primary}>
                            <span className={styles.index}>{ind + 1}.</span>
                            {quest.text}
                        </div>
                        <div className={styles.label + ' ' + styles.secondary + ' ' + styles.correct}>
                            Correct Answer: {quest.answer}
                        </div>
                        <div className={styles.label + ' ' + styles.secondary + ' ' + customClass}>
                            Your Attempt: {quest.userAns}
                        </div>
                    </li>
                );
            });

            return (
                <div className={styles.resultContainer}>
                    <div className={styles.label}>
                        <span className={styles.labelType}>Correct:
                            <span className={styles.value}>{this.props.totalCorrect}</span>
                        </span>
                        <span className={styles.labelType}>Total Questions:
                            <span className={styles.value}>{this.limitQuests}</span>
                        </span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progress} ref="progress"></div>
                    </div>
                    <ul className={styles.list}>
                        {resultQuestList}
                    </ul>
                </div>
            );
        }
        return null;
    }

    render() {
        let pageModal = null;
        if (this.state.isPopUpOpen) {
            const modalContent = (
                <PagePopUpContent handler={this.handleUserDetails}
                                  closePopUp={this.closePopUp}
                                  message={'Hey Ninja, what\'s your name?'}/>
            );
            pageModal = (
                <Modal title=""
                       content={modalContent}/>
            );
        }

        return (
            <div className={styles.homeContainer}>
                <div className={styles.homeContent}>
                    {this.renderWelcomeMsg()}
                    {this.renderQuestion()}
                    {this.renderTimer()}
                    {this.renderPostQuestion()}
                </div>
                {pageModal}
            </div>
        );
    }
}

/* Opening Screen: Ask user name */
class PagePopUpContent extends Component {
    static propTypes = {
        handler: PropTypes.func.isRequired,
        message: PropTypes.string,
        closePopUp: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);

        this.state = {fieldVal: ''};
    }

    render() {
        return (
            <div className={styles.pageModal}>
                <div className={styles.description}>{this.props.message}</div>
                <form onSubmit={(eve)=>{
                    eve.preventDefault();
                    if (this.refs.fieldVal.value) {
                        this.props.closePopUp();
                        this.props.handler(this.state.fieldVal);
                    }
                }}>
                <input type="text"
                       className={styles.field}
                       onChange={()=>this.setState({
                           fieldVal: this.refs.fieldVal.value
                       })}
                       ref="fieldVal"
                       value={this.state.fieldVal}/>
                {
                    this.state.fieldVal ? (
                        <span className={styles.actionBtn}
                              onClick= {()=>{
                                  if (this.refs.fieldVal.value) {
                                      this.props.closePopUp();
                                      this.props.handler(this.state.fieldVal);
                                  }
                              }}>Let's Play
                        </span>
                    ) : null
                }
                </form>
            </div>
        );
    }
}

