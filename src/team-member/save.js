import { useBlockProps, RichText } from '@wordpress/block-editor';

import { Icon } from '@wordpress/components';

export default function Save( { attributes } ) {
	const { name, bio, url, alt, id, socialLinks } = attributes;

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
			{ name && <RichText.Content tagName="h4" value={ name } /> }
			{ bio && <RichText.Content tagName="p" value={ bio } /> }
			{ socialLinks.length > 0 && (
				<div className="blocks-course-team-member-social-links">
					<ul>
						{ socialLinks.map( ( socialLink, index ) => {
							return (
								<li key={ index } data-icon={ socialLink.icon }>
									<a href={ socialLink.link }>
										<Icon icon={ socialLink.icon } />
									</a>
								</li>
							);
						} ) }
					</ul>
				</div>
			) }
		</div>
	);
}
