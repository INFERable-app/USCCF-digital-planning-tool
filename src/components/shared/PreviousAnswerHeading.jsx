import './PreviousAnswerHeading.css';

export default function PreviousAnswerHeading({ label }) {
	if (!label) return null;
	return <p className="previous-answer-heading">{label}</p>;
}
