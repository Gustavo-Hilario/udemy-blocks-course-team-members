import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { name, bio, url, alt, id } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			{ url && (
				<div className="block-team-member-img">
					<img
						src={ url }
						alt={ alt }
						// wp-image-{ id } is a class that adds responsive styles to the image
						className={ id ? `wp-image-${ id }` : null }
					/>
				</div>
			) }
			<RichText.Content tagName="h4" value={ name } />
			<RichText.Content tagName="p" value={ bio } />
		</div>
	);
}
