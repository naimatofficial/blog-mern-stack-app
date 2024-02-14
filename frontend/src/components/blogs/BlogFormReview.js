// BlogFormReview shows users their form inputs for review
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import formFields from "./formFields";
import { useNavigate } from "react-router-dom";
import * as actions from "../../actions";

function BlogFormReview(props) {
	const navigate = useNavigate();

	const renderFields = () => {
		const { formValues } = props;

		return _.map(formFields, ({ name, label }) => {
			return (
				<div key={name}>
					<label>{label}</label>
					<div>{formValues[name]}</div>
				</div>
			);
		});
	};

	const renderButtons = () => {
		const { onCancel } = props;

		return (
			<div>
				<button
					className="yellow darken-3 white-text btn-flat"
					onClick={onCancel}
				>
					Back
				</button>
				<button
					className="green btn-flat right white-text"
					onClick={handleSubmit}
				>
					Save Blog
					<i className="material-icons right">email</i>
				</button>
			</div>
		);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const { submitBlog, formValues } = props;

		submitBlog(formValues, navigate);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h5>Please confirm your entries</h5>
			{renderFields()}

			{renderButtons()}
		</form>
	);
}

function mapStateToProps(state) {
	return { formValues: state.form.blogForm.values };
}

export default connect(mapStateToProps, actions)(BlogFormReview);
