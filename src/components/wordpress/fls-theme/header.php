<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package FLS
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11"> <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	<div id="page" class="wrapper">
		<header class="header">
			<div class="header__container">
				<?php
				the_custom_logo();
				if (is_front_page() && is_home()) :
				?>
					<h1 class="site-title">
						<a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a>
					</h1>
				<?php
				else :
				?>
					<p class="site-title">
						<a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a>
					</p>
				<?php
				endif;
				$fls_description = get_bloginfo('description', 'display');
				if ($fls_description || is_customize_preview()) :
				?>
					<p class="site-description">
						<?php echo $fls_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
						?>
					</p>
				<?php endif; ?>
				<div class="header__menu menu">
					<button type="button" data-fls-menu class="menu__icon icon-menu"><span></span></button>
					<?php
					wp_nav_menu(
						array(
							'add_li_class' => 'menu__item',
							'add_link_class' => 'menu__link',
							'menu_class' => 'menu__list',
							'container' => 'nav',
							'container_class' => 'menu__body',
							'theme_location' => 'menu-1',
							'menu_id' => '',
						)
					); ?>
				</div>
			</div>
		</header>