import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { errorCode, sendContact } from '../helpers/api';
import { CODE_URL, CONTACT_EMAIL, ENGINE_URL, REPORT_URL } from '../helpers/links';
import { useSettings } from '../helpers/settings';
import { FieldLabel, FormPage, SendRow, Sent, Trap, useFields } from '../includes/forms';
import { usePageTitle } from '../includes/page';
import SideList from '../includes/side-list';

// What a message can be about; ?kind= picks one, so other pages can link to it.
const KINDS = ['message', 'problem'];
// The same limits the server checks
const MAX_TEXT = 5000;

const EMPTY = { name: '', email: '', link: '', text: '', website: '' };

function Contact() {
    const { t } = useSettings();
    usePageTitle(t.nav.contact);
    const [params, setParams] = useSearchParams();
    const kind = KINDS.includes(params.get('kind')) ? params.get('kind') : 'message';
    const [fields, set, reset] = useFields(EMPTY);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const sending = progress !== null;
    const errors = t.contact.errors;

    function choose(event) {
        setError('');
        setParams(event.target.value === 'message' ? {} : { kind: event.target.value }, { replace: true });
    }

    // What the server would refuse, caught before sending.
    function missing() {
        if (!fields.text.trim()) return 'no_text';
        return '';
    }

    // Only the fields of the chosen kind.
    function posted() {
        const { name, email, link, text, website } = fields;
        return { kind, name, email, link: kind === 'message' ? '' : link, text, website };
    }

    async function send(event) {
        event.preventDefault();
        if (sending) return;
        const problem = missing();
        if (problem) return setError(problem);
        setError('');
        setProgress(0);
        try {
            await sendContact(posted(), setProgress);
            setSent(true);
        } catch (e) {
            setError(errorCode(e, errors));
        } finally {
            setProgress(null);
        }
    }

    function again() {
        reset();
        setSent(false);
    }

    const elsewhere = [
        { mark: '!', name: t.contact.report, text: <>{ t.contact.reportText } <a href={ REPORT_URL }>{ t.contact.reportLink }</a></> },
        {
            mark: '#',
            name: t.contact.code,
            text: <>{ t.contact.codeText } <a href={ CODE_URL }>Bookflow</a> · <a href={ ENGINE_URL }>PDF2EPUB</a></>,
        },
    ];
    const side = <SideList title={ t.contact.elsewhere } items={ elsewhere } />;
    const sendLabel = kind === 'problem' ? t.contact.sendProblem : t.contact.send;

    if (sent) {
        return (
            <FormPage title={ t.contact.title } lead={ t.contact.lead } side={ side }>
                <Sent title={ t.contact.sentTitle } text={ t.contact.sentText }>
                    <button type="button" className="btn btn-cobalt px-4" onClick={ again }>{ t.contact.another }</button>
                </Sent>
            </FormPage>
        );
    }

    return (
        <FormPage title={ t.contact.title } lead={ t.contact.lead } side={ side }>
            <form className="bf-panel h-100 p-4 p-lg-5" onSubmit={ send } noValidate>
                <div className="row g-3 align-items-end">
                    <div className="col-12">
                        <FieldLabel htmlFor="bf-c-kind">{ t.contact.kind }</FieldLabel>
                        <select id="bf-c-kind" className="form-select" value={ kind } onChange={ choose }>
                            { KINDS.map((value) => <option key={ value } value={ value }>{ t.contact.kinds[value] }</option>) }
                        </select>
                    </div>

                    <div className="col-md-6">
                        <FieldLabel htmlFor="bf-c-name" optional={ t.contact.optional }>{ t.contact.name }</FieldLabel>
                        <input id="bf-c-name" className="form-control" autoComplete="name" maxLength={ 200 } value={ fields.name } onChange={ set('name') } />
                    </div>
                    <div className="col-md-6">
                        <FieldLabel htmlFor="bf-c-email" optional={ t.contact.optional }>{ t.contact.email }</FieldLabel>
                        <input id="bf-c-email" type="email" className="form-control" autoComplete="email" value={ fields.email } onChange={ set('email') } />
                    </div>
                    { kind !== 'message' && (
                        <div className="col-12">
                            <FieldLabel htmlFor="bf-c-link" optional={ t.contact.optional }>
                                { t.contact.problemLink }
                            </FieldLabel>
                            <input
                                id="bf-c-link"
                                className="form-control"
                                maxLength={ 500 }
                                placeholder={ t.contact.problemLinkPlaceholder }
                                value={ fields.link }
                                onChange={ set('link') }
                            />
                        </div>
                    ) }
                    <div className="col-12">
                        <FieldLabel htmlFor="bf-c-text">
                            { kind === 'problem' ? t.contact.problemText : t.contact.message }
                        </FieldLabel>
                        <textarea
                            id="bf-c-text"
                            className="form-control"
                            rows={ 6 }
                            maxLength={ MAX_TEXT }
                            value={ fields.text }
                            onChange={ set('text') }
                        />
                        <div className="form-text bf-muted">{ t.contact.emailHint }</div>
                    </div>
                    <Trap value={ fields.website } onChange={ set('website') } />
                </div>

                { error && <div className="bf-alert mt-4" role="alert">{ errors[error] }</div> }

                <SendRow>
                    <button type="submit" className="btn btn-cobalt btn-lg px-4" disabled={ sending }>
                        { sending ? t.contact.sending : sendLabel }
                    </button>
                    <span className="bf-muted">
                        { t.contact.orWrite } <a href={ `mailto:${CONTACT_EMAIL}` }>{ CONTACT_EMAIL }</a>
                    </span>
                </SendRow>
            </form>
        </FormPage>
    );
}

export default Contact;
