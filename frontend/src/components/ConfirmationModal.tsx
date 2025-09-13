import Button from './Button';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	isDangerous?: boolean;
}

function ConfirmationModal({
	isOpen,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	onCancel,
	isDangerous = false
}: ConfirmationModalProps) {
	if (!isOpen) return null;

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onCancel();
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Escape') {
			onCancel();
		} else if (e.key === 'Enter') {
			onConfirm();
		}
	};

	return (
		<div
			className="modal-backdrop"
			onClick={handleBackdropClick}
			onKeyDown={handleKeyDown}
			tabIndex={-1}
		>
			<div className="confirmation-modal">
				<div className="modal-header">
					<h2 className="modal-title">{title}</h2>
					<button
						className="modal-close-button"
						onClick={onCancel}
						aria-label="Close modal"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div className="modal-body">
					<p className="modal-message">{message}</p>
				</div>

				<div className="modal-footer">
					<Button
						variant="secondary"
						onClick={onCancel}
						size="medium"
					>
						{cancelText}
					</Button>
					<Button
						variant={isDangerous ? 'danger' : 'primary'}
						onClick={onConfirm}
						size="medium"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationModal;
