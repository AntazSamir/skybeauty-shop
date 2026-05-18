<?php
/**
 * Plugin Name: SkyBD Social Login JWT Bridge
 * Description: Bridges Nextend Social Login with JWT Authentication for WP REST API for headless React setups.
 * Version: 1.0.0
 * Author: Antigravity AI
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

add_filter('nsl_redirect_url', function($redirect_url, $provider) {
    // Intercept social log-ins (Google, Facebook, Apple, etc.)
    if (in_array($provider->getId(), array('google', 'facebook', 'apple'))) {
        $user = wp_get_current_user();
        if ($user && $user->ID) {
            // Verify if JWT Authentication plugin is installed and configured
            if (class_exists('\JWT_Auth\Public\JWT_Auth_Public') || class_exists('JWT_Auth')) {
                $secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : '';
                
                if (!empty($secret_key)) {
                    $issuedAt = time();
                    $expire = $issuedAt + (DAY_IN_SECONDS * 30); // 30-day session expiry
                    
                    $token = array(
                        'iss' => get_bloginfo('url'),
                        'iat' => $issuedAt,
                        'nbf' => $issuedAt,
                        'exp' => $expire,
                        'data' => array(
                            'user' => array(
                                'id' => $user->ID,
                            ),
                        ),
                    );
                    
                    if (class_exists('\Firebase\JWT\JWT')) {
                        try {
                            // Encode JWT using WordPress JWT Secret Key
                            $jwt = \Firebase\JWT\JWT::encode($token, $secret_key, 'HS256');
                            
                            // Appends token, email and display name to the redirect URL dynamically.
                            // Nextend Social Login automatically preserves the initial redirect URL 
                            // (e.g. http://localhost:5173/login), so this is completely environment-agnostic!
                            return add_query_arg(array(
                                'token'        => $jwt,
                                'email'        => $user->user_email,
                                'display_name' => $user->display_name
                            ), $redirect_url);
                        } catch (Exception $e) {
                            // Silent fail, falls back to default monolithic redirect URL
                        }
                    }
                }
            }
        }
    }
    return $redirect_url;
}, 99, 2);
