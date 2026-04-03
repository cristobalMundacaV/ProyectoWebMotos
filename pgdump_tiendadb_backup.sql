--
-- PostgreSQL database dump
--

\restrict O2g6PSZm0Ed99uyPU7NS7NcmTGepzpPk4Z5opuIIwDxL5NiQZiwGJlhbPmcxPVX

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outs_user_id_83bc629a_fk_auth_user;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk;
ALTER TABLE IF EXISTS ONLY public.productos_producto DROP CONSTRAINT IF EXISTS productos_producto_subcategoria_id_3e19f3d9_fk_catalogo_;
ALTER TABLE IF EXISTS ONLY public.productos_producto DROP CONSTRAINT IF EXISTS productos_producto_marca_id_fc6a9dea_fk_catalogo_marca_id;
ALTER TABLE IF EXISTS ONLY public.productos_imagenproducto DROP CONSTRAINT IF EXISTS productos_imagenprod_producto_id_685baa36_fk_productos;
ALTER TABLE IF EXISTS ONLY public.productos_especificacionproducto DROP CONSTRAINT IF EXISTS productos_especifica_producto_id_2262c53b_fk_productos;
ALTER TABLE IF EXISTS ONLY public.productos_compatibilidadproductomoto DROP CONSTRAINT IF EXISTS productos_compatibil_producto_id_ba87c192_fk_productos;
ALTER TABLE IF EXISTS ONLY public.productos_compatibilidadproductomoto DROP CONSTRAINT IF EXISTS productos_compatibil_moto_id_da92d417_fk_motos_mot;
ALTER TABLE IF EXISTS ONLY public.motos_valoratributomoto DROP CONSTRAINT IF EXISTS motos_valoratributomoto_moto_id_950f691e_fk_motos_moto_id;
ALTER TABLE IF EXISTS ONLY public.motos_valoratributomoto DROP CONSTRAINT IF EXISTS motos_valoratributom_tipo_atributo_id_4116b968_fk_motos_tip;
ALTER TABLE IF EXISTS ONLY public.motos_seccionfichatecnica DROP CONSTRAINT IF EXISTS motos_seccionfichatecnica_moto_id_c24967de_fk_motos_moto_id;
ALTER TABLE IF EXISTS ONLY public.motos_moto DROP CONSTRAINT IF EXISTS motos_moto_modelo_moto_id_e27e75bd_fk_motos_modelomoto_id;
ALTER TABLE IF EXISTS ONLY public.motos_moto DROP CONSTRAINT IF EXISTS motos_moto_marca_id_bc0a51d0_fk_catalogo_marca_id;
ALTER TABLE IF EXISTS ONLY public.motos_modelomoto DROP CONSTRAINT IF EXISTS motos_modelomoto_marca_id_fc044d84_fk_catalogo_marca_id;
ALTER TABLE IF EXISTS ONLY public.motos_modelomoto DROP CONSTRAINT IF EXISTS motos_modelomoto_categoria_id_323ecdc7_fk_catalogo_;
ALTER TABLE IF EXISTS ONLY public.motos_itemfichatecnica DROP CONSTRAINT IF EXISTS motos_itemfichatecni_seccion_id_d2cc533c_fk_motos_sec;
ALTER TABLE IF EXISTS ONLY public.motos_imagenmoto DROP CONSTRAINT IF EXISTS motos_imagenmoto_moto_id_a3a86a1c_fk_motos_moto_id;
ALTER TABLE IF EXISTS ONLY public.motos_especificacionmoto DROP CONSTRAINT IF EXISTS motos_especificacionmoto_moto_id_766053b3_fk_motos_moto_id;
ALTER TABLE IF EXISTS ONLY public.mantenciones_vehiculocliente DROP CONSTRAINT IF EXISTS mantenciones_vehicul_cliente_id_29d4e4ee_fk_auth_user;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencion DROP CONSTRAINT IF EXISTS mantenciones_mantenc_moto_cliente_id_d2f8163a_fk_mantencio;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionestadohistorial DROP CONSTRAINT IF EXISTS mantenciones_mantenc_mantencion_id_2a48a298_fk_mantencio;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionestadohistorial DROP CONSTRAINT IF EXISTS mantenciones_mantenc_changed_by_id_eec5f623_fk_auth_user;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.core_auditlog DROP CONSTRAINT IF EXISTS core_auditlog_actor_id_ab091f3c_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.clientes_perfilusuario DROP CONSTRAINT IF EXISTS clientes_perfilusuario_user_id_5e5dcb6d_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.clientes_contactocliente DROP CONSTRAINT IF EXISTS clientes_contactocliente_moto_id_15a41aaf_fk_motos_moto_id;
ALTER TABLE IF EXISTS ONLY public.clientes_contactocliente DROP CONSTRAINT IF EXISTS clientes_contactocli_producto_id_7e4cd3df_fk_productos;
ALTER TABLE IF EXISTS ONLY public.catalogo_subcategoriaproducto DROP CONSTRAINT IF EXISTS catalogo_subcategori_categoria_id_de577b4f_fk_catalogo_;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_user_id_35299eff_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.analitica_catalogoevento DROP CONSTRAINT IF EXISTS analitica_catalogoevento_usuario_id_16f85fb0_fk_auth_user_id;
DROP INDEX IF EXISTS public.uq_producto_semantic_nomarca;
DROP INDEX IF EXISTS public.uq_producto_semantic_marca;
DROP INDEX IF EXISTS public.uniq_mantencion_activa_por_moto_slot;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_user_id_83bc629a;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like;
DROP INDEX IF EXISTS public.productos_producto_subcategoria_id_3e19f3d9;
DROP INDEX IF EXISTS public.productos_producto_slug_8e5f75e2_like;
DROP INDEX IF EXISTS public.productos_producto_marca_id_fc6a9dea;
DROP INDEX IF EXISTS public.productos_imagenproducto_producto_id_685baa36;
DROP INDEX IF EXISTS public.productos_especificacionproducto_producto_id_2262c53b;
DROP INDEX IF EXISTS public.productos_compatibilidadproductomoto_producto_id_ba87c192;
DROP INDEX IF EXISTS public.productos_compatibilidadproductomoto_moto_id_da92d417;
DROP INDEX IF EXISTS public.motos_valoratributomoto_tipo_atributo_id_4116b968;
DROP INDEX IF EXISTS public.motos_valoratributomoto_moto_id_950f691e;
DROP INDEX IF EXISTS public.motos_tipoatributo_slug_d6c9bef1_like;
DROP INDEX IF EXISTS public.motos_seccionfichatecnica_moto_id_c24967de;
DROP INDEX IF EXISTS public.motos_moto_slug_cb5ee6e2_like;
DROP INDEX IF EXISTS public.motos_moto_modelo_moto_id_e27e75bd;
DROP INDEX IF EXISTS public.motos_moto_marca_id_bc0a51d0;
DROP INDEX IF EXISTS public.motos_modelomoto_slug_77526682_like;
DROP INDEX IF EXISTS public.motos_modelomoto_marca_id_fc044d84;
DROP INDEX IF EXISTS public.motos_modelomoto_categoria_id_323ecdc7;
DROP INDEX IF EXISTS public.motos_itemfichatecnica_seccion_id_d2cc533c;
DROP INDEX IF EXISTS public.motos_imagenmoto_moto_id_a3a86a1c;
DROP INDEX IF EXISTS public.motos_especificacionmoto_moto_id_766053b3;
DROP INDEX IF EXISTS public.mantenciones_vehiculocliente_matricula_ed771e22_like;
DROP INDEX IF EXISTS public.mantenciones_vehiculocliente_cliente_id_29d4e4ee;
DROP INDEX IF EXISTS public.mantenciones_mantencionestadohistorial_mantencion_id_2a48a298;
DROP INDEX IF EXISTS public.mantenciones_mantencionestadohistorial_changed_by_id_eec5f623;
DROP INDEX IF EXISTS public.mantenciones_mantencion_rut_cliente_03583757_like;
DROP INDEX IF EXISTS public.mantenciones_mantencion_rut_cliente_03583757;
DROP INDEX IF EXISTS public.mantenciones_mantencion_moto_cliente_id_d2f8163a;
DROP INDEX IF EXISTS public.idx_valoratrib_moto_tipo_ord;
DROP INDEX IF EXISTS public.idx_subcat_act_cat_nom;
DROP INDEX IF EXISTS public.idx_producto_precio;
DROP INDEX IF EXISTS public.idx_producto_destacado_ord;
DROP INDEX IF EXISTS public.idx_producto_act_sub_marca;
DROP INDEX IF EXISTS public.idx_perfilusuario_rol;
DROP INDEX IF EXISTS public.idx_moto_marca_modelo_act;
DROP INDEX IF EXISTS public.idx_moto_home_feed;
DROP INDEX IF EXISTS public.idx_moto_estado_activa;
DROP INDEX IF EXISTS public.idx_moto_activa_modelo;
DROP INDEX IF EXISTS public.idx_modelomoto_act_marca_nom;
DROP INDEX IF EXISTS public.idx_marca_activa_tipo_nom;
DROP INDEX IF EXISTS public.idx_mantencion_tipo;
DROP INDEX IF EXISTS public.idx_mantencion_fecha_ingreso;
DROP INDEX IF EXISTS public.idx_mantencion_fecha_hora;
DROP INDEX IF EXISTS public.idx_mantencion_estado;
DROP INDEX IF EXISTS public.idx_mantencion_created_estado;
DROP INDEX IF EXISTS public.idx_mantencion_created_at;
DROP INDEX IF EXISTS public.idx_mant_hora_bloq_fecha;
DROP INDEX IF EXISTS public.idx_mant_hora_bloq_estado;
DROP INDEX IF EXISTS public.idx_mant_hor_fecha_activo;
DROP INDEX IF EXISTS public.idx_mant_hor_fecha;
DROP INDEX IF EXISTS public.idx_mant_dia_bloq_fecha;
DROP INDEX IF EXISTS public.idx_mant_dia_bloq_estado;
DROP INDEX IF EXISTS public.idx_imagenprod_prod_orden;
DROP INDEX IF EXISTS public.idx_imagenmoto_moto_orden;
DROP INDEX IF EXISTS public.idx_hist_mant_mant_fecha;
DROP INDEX IF EXISTS public.idx_hist_mant_estado_nuevo;
DROP INDEX IF EXISTS public.idx_hist_mant_changed_at;
DROP INDEX IF EXISTS public.idx_contactocliente_producto;
DROP INDEX IF EXISTS public.idx_contactocliente_moto;
DROP INDEX IF EXISTS public.idx_contactocliente_fecha;
DROP INDEX IF EXISTS public.idx_compat_producto;
DROP INDEX IF EXISTS public.idx_compat_moto_producto;
DROP INDEX IF EXISTS public.idx_catprod_activa_nombre;
DROP INDEX IF EXISTS public.idx_cat_event_tipo_fecha;
DROP INDEX IF EXISTS public.idx_cat_event_tipo_entidad;
DROP INDEX IF EXISTS public.idx_cat_event_session_fecha;
DROP INDEX IF EXISTS public.idx_cat_event_evento_fecha;
DROP INDEX IF EXISTS public.idx_cat_event_created;
DROP INDEX IF EXISTS public.idx_audit_entidad_fecha;
DROP INDEX IF EXISTS public.idx_audit_actor_fecha;
DROP INDEX IF EXISTS public.idx_audit_accion_fecha;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.core_auditlog_request_id_ba615c25_like;
DROP INDEX IF EXISTS public.core_auditlog_request_id_ba615c25;
DROP INDEX IF EXISTS public.core_auditlog_entidad_id_aa8aa513_like;
DROP INDEX IF EXISTS public.core_auditlog_entidad_id_aa8aa513;
DROP INDEX IF EXISTS public.core_auditlog_entidad_1d79c7b3_like;
DROP INDEX IF EXISTS public.core_auditlog_entidad_1d79c7b3;
DROP INDEX IF EXISTS public.core_auditlog_actor_id_ab091f3c;
DROP INDEX IF EXISTS public.core_auditlog_accion_3cf13ff1_like;
DROP INDEX IF EXISTS public.core_auditlog_accion_3cf13ff1;
DROP INDEX IF EXISTS public.clientes_contactocliente_producto_id_7e4cd3df;
DROP INDEX IF EXISTS public.clientes_contactocliente_moto_id_15a41aaf;
DROP INDEX IF EXISTS public.catalogo_subcategoriaproducto_slug_323876e6_like;
DROP INDEX IF EXISTS public.catalogo_subcategoriaproducto_categoria_id_de577b4f;
DROP INDEX IF EXISTS public.catalogo_marca_slug_cf579a2b_like;
DROP INDEX IF EXISTS public.catalogo_categoriaproducto_slug_e46c838d_like;
DROP INDEX IF EXISTS public.catalogo_categoriamoto_slug_dd08a1ef_like;
DROP INDEX IF EXISTS public.authtoken_token_key_10f0b77e_like;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
DROP INDEX IF EXISTS public.analitica_catalogoevento_usuario_id_16f85fb0;
DROP INDEX IF EXISTS public.analitica_catalogoevento_entidad_slug_62514311_like;
DROP INDEX IF EXISTS public.analitica_catalogoevento_entidad_slug_62514311;
ALTER TABLE IF EXISTS ONLY public.motos_valoratributomoto DROP CONSTRAINT IF EXISTS uq_valoratributomoto_moto_tipoatributo_nombre;
ALTER TABLE IF EXISTS ONLY public.motos_seccionfichatecnica DROP CONSTRAINT IF EXISTS uq_seccionfichatecnica_moto_orden;
ALTER TABLE IF EXISTS ONLY public.motos_modelomoto DROP CONSTRAINT IF EXISTS uq_modelomoto_marca_nombre_modelo;
ALTER TABLE IF EXISTS ONLY public.motos_itemfichatecnica DROP CONSTRAINT IF EXISTS uq_itemfichatecnica_seccion_orden;
ALTER TABLE IF EXISTS ONLY public.productos_especificacionproducto DROP CONSTRAINT IF EXISTS uq_especprod_producto_clave;
ALTER TABLE IF EXISTS ONLY public.motos_especificacionmoto DROP CONSTRAINT IF EXISTS uq_especmoto_moto_clave;
ALTER TABLE IF EXISTS ONLY public.productos_compatibilidadproductomoto DROP CONSTRAINT IF EXISTS uq_compat_producto_moto;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionhorabloqueada DROP CONSTRAINT IF EXISTS uniq_mant_hora_bloq_fecha_hora;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.productos_producto DROP CONSTRAINT IF EXISTS productos_producto_slug_key;
ALTER TABLE IF EXISTS ONLY public.productos_producto DROP CONSTRAINT IF EXISTS productos_producto_pkey;
ALTER TABLE IF EXISTS ONLY public.productos_imagenproducto DROP CONSTRAINT IF EXISTS productos_imagenproducto_pkey;
ALTER TABLE IF EXISTS ONLY public.productos_especificacionproducto DROP CONSTRAINT IF EXISTS productos_especificacionproducto_pkey;
ALTER TABLE IF EXISTS ONLY public.productos_compatibilidadproductomoto DROP CONSTRAINT IF EXISTS productos_compatibilidadproductomoto_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_valoratributomoto DROP CONSTRAINT IF EXISTS motos_valoratributomoto_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_tipoatributo DROP CONSTRAINT IF EXISTS motos_tipoatributo_slug_key;
ALTER TABLE IF EXISTS ONLY public.motos_tipoatributo DROP CONSTRAINT IF EXISTS motos_tipoatributo_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_seccionfichatecnica DROP CONSTRAINT IF EXISTS motos_seccionfichatecnica_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_moto DROP CONSTRAINT IF EXISTS motos_moto_slug_key;
ALTER TABLE IF EXISTS ONLY public.motos_moto DROP CONSTRAINT IF EXISTS motos_moto_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_modelomoto DROP CONSTRAINT IF EXISTS motos_modelomoto_slug_key;
ALTER TABLE IF EXISTS ONLY public.motos_modelomoto DROP CONSTRAINT IF EXISTS motos_modelomoto_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_itemfichatecnica DROP CONSTRAINT IF EXISTS motos_itemfichatecnica_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_imagenmoto DROP CONSTRAINT IF EXISTS motos_imagenmoto_pkey;
ALTER TABLE IF EXISTS ONLY public.motos_especificacionmoto DROP CONSTRAINT IF EXISTS motos_especificacionmoto_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_vehiculocliente DROP CONSTRAINT IF EXISTS mantenciones_vehiculocliente_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_vehiculocliente DROP CONSTRAINT IF EXISTS mantenciones_vehiculocliente_matricula_key;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionhorariofecha DROP CONSTRAINT IF EXISTS mantenciones_mantencionhorariofecha_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionhorariofecha DROP CONSTRAINT IF EXISTS mantenciones_mantencionhorariofecha_fecha_key;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionhorabloqueada DROP CONSTRAINT IF EXISTS mantenciones_mantencionhorabloqueada_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencionestadohistorial DROP CONSTRAINT IF EXISTS mantenciones_mantencionestadohistorial_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantenciondiabloqueado DROP CONSTRAINT IF EXISTS mantenciones_mantenciondiabloqueado_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantenciondiabloqueado DROP CONSTRAINT IF EXISTS mantenciones_mantenciondiabloqueado_fecha_key;
ALTER TABLE IF EXISTS ONLY public.mantenciones_mantencion DROP CONSTRAINT IF EXISTS mantenciones_mantencion_pkey;
ALTER TABLE IF EXISTS ONLY public.mantenciones_horariomantencion DROP CONSTRAINT IF EXISTS mantenciones_horariomantencion_pkey;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.core_contactositio DROP CONSTRAINT IF EXISTS core_contactositio_pkey;
ALTER TABLE IF EXISTS ONLY public.core_auditlog DROP CONSTRAINT IF EXISTS core_auditlog_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes_perfilusuario DROP CONSTRAINT IF EXISTS clientes_perfilusuario_user_id_key;
ALTER TABLE IF EXISTS ONLY public.clientes_perfilusuario DROP CONSTRAINT IF EXISTS clientes_perfilusuario_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes_contactocliente DROP CONSTRAINT IF EXISTS clientes_contactocliente_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_subcategoriaproducto DROP CONSTRAINT IF EXISTS catalogo_subcategoriaproducto_slug_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_subcategoriaproducto DROP CONSTRAINT IF EXISTS catalogo_subcategoriaproducto_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_marca DROP CONSTRAINT IF EXISTS catalogo_marca_slug_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_marca DROP CONSTRAINT IF EXISTS catalogo_marca_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_categoriaproducto DROP CONSTRAINT IF EXISTS catalogo_categoriaproducto_slug_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_categoriaproducto DROP CONSTRAINT IF EXISTS catalogo_categoriaproducto_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_categoriamoto DROP CONSTRAINT IF EXISTS catalogo_categoriamoto_slug_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_categoriamoto DROP CONSTRAINT IF EXISTS catalogo_categoriamoto_pkey;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_user_id_key;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.analitica_catalogoevento DROP CONSTRAINT IF EXISTS analitica_catalogoevento_pkey;
DROP TABLE IF EXISTS public.token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS public.token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS public.productos_producto;
DROP TABLE IF EXISTS public.productos_imagenproducto;
DROP TABLE IF EXISTS public.productos_especificacionproducto;
DROP TABLE IF EXISTS public.productos_compatibilidadproductomoto;
DROP TABLE IF EXISTS public.motos_valoratributomoto;
DROP TABLE IF EXISTS public.motos_tipoatributo;
DROP TABLE IF EXISTS public.motos_seccionfichatecnica;
DROP TABLE IF EXISTS public.motos_moto;
DROP TABLE IF EXISTS public.motos_modelomoto;
DROP TABLE IF EXISTS public.motos_itemfichatecnica;
DROP TABLE IF EXISTS public.motos_imagenmoto;
DROP TABLE IF EXISTS public.motos_especificacionmoto;
DROP TABLE IF EXISTS public.mantenciones_vehiculocliente;
DROP TABLE IF EXISTS public.mantenciones_mantencionhorariofecha;
DROP TABLE IF EXISTS public.mantenciones_mantencionhorabloqueada;
DROP TABLE IF EXISTS public.mantenciones_mantencionestadohistorial;
DROP TABLE IF EXISTS public.mantenciones_mantenciondiabloqueado;
DROP TABLE IF EXISTS public.mantenciones_mantencion;
DROP TABLE IF EXISTS public.mantenciones_horariomantencion;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.core_contactositio;
DROP TABLE IF EXISTS public.core_auditlog;
DROP TABLE IF EXISTS public.clientes_perfilusuario;
DROP TABLE IF EXISTS public.clientes_contactocliente;
DROP TABLE IF EXISTS public.catalogo_subcategoriaproducto;
DROP TABLE IF EXISTS public.catalogo_marca;
DROP TABLE IF EXISTS public.catalogo_categoriaproducto;
DROP TABLE IF EXISTS public.catalogo_categoriamoto;
DROP TABLE IF EXISTS public.authtoken_token;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.analitica_catalogoevento;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analitica_catalogoevento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analitica_catalogoevento (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    tipo_evento character varying(24) NOT NULL,
    tipo_entidad character varying(20) NOT NULL,
    entidad_id integer,
    entidad_slug character varying(180) NOT NULL,
    entidad_nombre character varying(220) NOT NULL,
    session_id character varying(80) NOT NULL,
    ip_address inet,
    user_agent text NOT NULL,
    origen character varying(255) NOT NULL,
    metadata jsonb NOT NULL,
    usuario_id integer,
    CONSTRAINT analitica_catalogoevento_entidad_id_check CHECK ((entidad_id >= 0))
);


--
-- Name: analitica_catalogoevento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.analitica_catalogoevento ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.analitica_catalogoevento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: catalogo_categoriamoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_categoriamoto (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    activa boolean NOT NULL,
    CONSTRAINT chk_catalogo_categoriamoto_nombre_not_empty CHECK ((NOT ((nombre)::text = ''::text)))
);


--
-- Name: catalogo_categoriamoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.catalogo_categoriamoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.catalogo_categoriamoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: catalogo_categoriaproducto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_categoriaproducto (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    activa boolean NOT NULL,
    CONSTRAINT chk_catalogo_categoriaprod_nombre_not_empty CHECK ((NOT ((nombre)::text = ''::text)))
);


--
-- Name: catalogo_categoriaproducto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.catalogo_categoriaproducto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.catalogo_categoriaproducto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: catalogo_marca; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_marca (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    slug character varying(50) NOT NULL,
    url_logo character varying(200) NOT NULL,
    descripcion text NOT NULL,
    activa boolean NOT NULL,
    tipo character varying(32) NOT NULL,
    CONSTRAINT chk_catalogo_marca_nombre_not_empty CHECK ((NOT ((nombre)::text = ''::text))),
    CONSTRAINT chk_catalogo_marca_tipo_not_empty CHECK ((NOT ((tipo)::text = ''::text)))
);


--
-- Name: catalogo_marca_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.catalogo_marca ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.catalogo_marca_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: catalogo_subcategoriaproducto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_subcategoriaproducto (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    activa boolean NOT NULL,
    categoria_id bigint NOT NULL,
    CONSTRAINT chk_catalogo_subcat_nombre_not_empty CHECK ((NOT ((nombre)::text = ''::text)))
);


--
-- Name: catalogo_subcategoriaproducto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.catalogo_subcategoriaproducto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.catalogo_subcategoriaproducto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clientes_contactocliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes_contactocliente (
    id bigint NOT NULL,
    telefono character varying(30) NOT NULL,
    email character varying(254) NOT NULL,
    mensaje text NOT NULL,
    fecha_creacion timestamp with time zone NOT NULL,
    moto_id bigint,
    producto_id bigint,
    nombres character varying(120) NOT NULL,
    apellidos character varying(120) NOT NULL,
    CONSTRAINT chk_contactocliente_apellidos_not_empty CHECK ((NOT ((apellidos)::text = ''::text))),
    CONSTRAINT chk_contactocliente_nombres_not_empty CHECK ((NOT ((nombres)::text = ''::text))),
    CONSTRAINT chk_contactocliente_telefono_not_empty CHECK ((NOT ((telefono)::text = ''::text)))
);


--
-- Name: clientes_contactocliente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.clientes_contactocliente ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.clientes_contactocliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clientes_perfilusuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes_perfilusuario (
    id bigint NOT NULL,
    telefono character varying(30) NOT NULL,
    rol character varying(20) NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT chk_perfilusuario_rol_not_empty CHECK ((NOT ((rol)::text = ''::text)))
);


--
-- Name: clientes_perfilusuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.clientes_perfilusuario ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.clientes_perfilusuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: core_auditlog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.core_auditlog (
    id bigint NOT NULL,
    creado_en timestamp with time zone NOT NULL,
    request_id character varying(64) NOT NULL,
    entidad character varying(120) NOT NULL,
    entidad_id character varying(64) NOT NULL,
    accion character varying(20) NOT NULL,
    before jsonb,
    after jsonb,
    metadata jsonb NOT NULL,
    actor_id integer
);


--
-- Name: core_auditlog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.core_auditlog ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.core_auditlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: core_contactositio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.core_contactositio (
    id bigint NOT NULL,
    instagram character varying(120) NOT NULL,
    telefono character varying(60) NOT NULL,
    ubicacion character varying(180) NOT NULL,
    actualizado_en timestamp with time zone NOT NULL
);


--
-- Name: core_contactositio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.core_contactositio ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.core_contactositio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: mantenciones_horariomantencion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_horariomantencion (
    id bigint NOT NULL,
    dia_semana smallint NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    intervalo_minutos smallint NOT NULL,
    cupos_por_bloque smallint NOT NULL,
    activo boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT mantenciones_horariomantencion_cupos_por_bloque_check CHECK ((cupos_por_bloque >= 0)),
    CONSTRAINT mantenciones_horariomantencion_dia_semana_check CHECK ((dia_semana >= 0)),
    CONSTRAINT mantenciones_horariomantencion_intervalo_minutos_check CHECK ((intervalo_minutos >= 0))
);


--
-- Name: mantenciones_horariomantencion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_horariomantencion ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_horariomantencion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_mantencion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_mantencion (
    id bigint NOT NULL,
    fecha_ingreso date NOT NULL,
    kilometraje_ingreso integer,
    tipo_mantencion character varying(30) NOT NULL,
    motivo text NOT NULL,
    diagnostico text NOT NULL,
    trabajo_realizado text NOT NULL,
    costo_total numeric(12,2) NOT NULL,
    estado character varying(24) NOT NULL,
    fecha_entrega date,
    observaciones text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    moto_cliente_id bigint NOT NULL,
    hora_ingreso time without time zone,
    rut_cliente character varying(12) NOT NULL,
    reminder_sent_at timestamp with time zone,
    motivo_cancelacion text NOT NULL,
    CONSTRAINT chk_mantencion_costo_total_non_negative CHECK ((costo_total >= (0)::numeric)),
    CONSTRAINT chk_mantencion_entregada_requiere_fecha_entrega CHECK (((NOT ((estado)::text = 'entregada'::text)) OR (fecha_entrega IS NOT NULL))),
    CONSTRAINT chk_mantencion_estado_requiere_ingreso CHECK (((NOT ((estado)::text = ANY (ARRAY[('en_proceso'::character varying)::text, ('en_espera'::character varying)::text, ('finalizado'::character varying)::text, ('entregada'::character varying)::text]))) OR ((hora_ingreso IS NOT NULL) AND (kilometraje_ingreso IS NOT NULL)))),
    CONSTRAINT chk_mantencion_fecha_entrega_gte_ingreso CHECK (((fecha_entrega IS NULL) OR (fecha_entrega >= fecha_ingreso))),
    CONSTRAINT chk_mantencion_km_ingreso_non_negative CHECK (((kilometraje_ingreso IS NULL) OR (kilometraje_ingreso >= 0))),
    CONSTRAINT chk_mantencion_rut_not_empty CHECK ((NOT ((rut_cliente)::text = ''::text)))
);


--
-- Name: mantenciones_mantencion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_mantencion ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_mantencion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_mantenciondiabloqueado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_mantenciondiabloqueado (
    id bigint NOT NULL,
    fecha date NOT NULL,
    bloqueado boolean NOT NULL,
    motivo character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: mantenciones_mantenciondiabloqueado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_mantenciondiabloqueado ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_mantenciondiabloqueado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_mantencionestadohistorial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_mantencionestadohistorial (
    id bigint NOT NULL,
    estado_anterior character varying(24) NOT NULL,
    estado_nuevo character varying(24) NOT NULL,
    fuente character varying(24) NOT NULL,
    observacion character varying(255) NOT NULL,
    changed_at timestamp with time zone NOT NULL,
    changed_by_id integer,
    mantencion_id bigint NOT NULL
);


--
-- Name: mantenciones_mantencionestadohistorial_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_mantencionestadohistorial ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_mantencionestadohistorial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_mantencionhorabloqueada; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_mantencionhorabloqueada (
    id bigint NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    bloqueado boolean NOT NULL,
    motivo character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: mantenciones_mantencionhorabloqueada_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_mantencionhorabloqueada ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_mantencionhorabloqueada_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_mantencionhorariofecha; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_mantencionhorariofecha (
    id bigint NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    intervalo_minutos smallint NOT NULL,
    cupos_por_bloque smallint NOT NULL,
    activo boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT mantenciones_mantencionhorariofecha_cupos_por_bloque_check CHECK ((cupos_por_bloque >= 0)),
    CONSTRAINT mantenciones_mantencionhorariofecha_intervalo_minutos_check CHECK ((intervalo_minutos >= 0))
);


--
-- Name: mantenciones_mantencionhorariofecha_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_mantencionhorariofecha ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_mantencionhorariofecha_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mantenciones_vehiculocliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantenciones_vehiculocliente (
    id bigint NOT NULL,
    matricula character varying(20) NOT NULL,
    marca character varying(80) NOT NULL,
    modelo character varying(120) NOT NULL,
    anio integer,
    kilometraje_actual integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    cliente_id integer NOT NULL,
    cliente_apellidos character varying(120) NOT NULL,
    cliente_email character varying(254) NOT NULL,
    cliente_nombres character varying(120) NOT NULL,
    cliente_telefono character varying(30) NOT NULL
);


--
-- Name: mantenciones_vehiculocliente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mantenciones_vehiculocliente ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mantenciones_vehiculocliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_especificacionmoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_especificacionmoto (
    id bigint NOT NULL,
    clave character varying(100) NOT NULL,
    valor character varying(255) NOT NULL,
    moto_id bigint NOT NULL,
    CONSTRAINT chk_especmoto_clave_not_empty CHECK ((NOT ((clave)::text = ''::text)))
);


--
-- Name: motos_especificacionmoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_especificacionmoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_especificacionmoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_imagenmoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_imagenmoto (
    id bigint NOT NULL,
    imagen character varying(100),
    texto_alternativo character varying(255) NOT NULL,
    orden integer NOT NULL,
    moto_id bigint NOT NULL,
    CONSTRAINT chk_imagenmoto_orden_gte_0 CHECK ((orden >= 0))
);


--
-- Name: motos_imagenmoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_imagenmoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_imagenmoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_itemfichatecnica; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_itemfichatecnica (
    id bigint NOT NULL,
    nombre character varying(120) NOT NULL,
    valor text NOT NULL,
    orden integer NOT NULL,
    seccion_id bigint NOT NULL,
    CONSTRAINT motos_itemfichatecnica_orden_check CHECK ((orden >= 0))
);


--
-- Name: motos_itemfichatecnica_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_itemfichatecnica ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_itemfichatecnica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_modelomoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_modelomoto (
    id bigint NOT NULL,
    nombre_modelo character varying(150) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    activo boolean NOT NULL,
    marca_id bigint NOT NULL,
    capacidad_estanque numeric(7,2),
    categoria_id bigint,
    cilindrada integer,
    peso numeric(7,2),
    potencia numeric(7,2),
    refrigeracion character varying(120) NOT NULL,
    tipo_motor character varying(120) NOT NULL,
    torque numeric(7,2),
    transmision character varying(120) NOT NULL,
    CONSTRAINT chk_modelomoto_cilindrada_gt_0 CHECK (((cilindrada IS NULL) OR (cilindrada > 0))),
    CONSTRAINT chk_modelomoto_estanque_gte_0 CHECK (((capacidad_estanque IS NULL) OR (capacidad_estanque >= (0)::numeric))),
    CONSTRAINT chk_modelomoto_peso_gte_0 CHECK (((peso IS NULL) OR (peso >= (0)::numeric))),
    CONSTRAINT chk_modelomoto_potencia_gte_0 CHECK (((potencia IS NULL) OR (potencia >= (0)::numeric))),
    CONSTRAINT chk_modelomoto_torque_gte_0 CHECK (((torque IS NULL) OR (torque >= (0)::numeric)))
);


--
-- Name: motos_modelomoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_modelomoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_modelomoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_moto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_moto (
    id bigint NOT NULL,
    modelo character varying(150) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(12,2) NOT NULL,
    anio integer NOT NULL,
    imagen_principal character varying(100),
    es_destacada boolean NOT NULL,
    activa boolean NOT NULL,
    fecha_creacion timestamp with time zone NOT NULL,
    marca_id bigint NOT NULL,
    color character varying(60) NOT NULL,
    estado character varying(20) NOT NULL,
    modelo_moto_id bigint NOT NULL,
    orden_carrusel integer NOT NULL,
    imagen_con_maletas character varying(100),
    permite_variante_maletas boolean NOT NULL,
    precio_con_maletas numeric(12,2),
    precio_lista numeric(12,2) NOT NULL,
    precio_lista_con_maletas numeric(12,2),
    video_presentacion character varying(500) NOT NULL,
    CONSTRAINT chk_moto_anio_range CHECK (((anio >= 1990) AND (anio <= 2100))),
    CONSTRAINT chk_moto_lista_gte_precio CHECK ((precio_lista >= precio)),
    CONSTRAINT chk_moto_lista_maletas_gte_precio CHECK (((precio_lista_con_maletas IS NULL) OR (precio_con_maletas IS NULL) OR (precio_lista_con_maletas >= precio_con_maletas))),
    CONSTRAINT chk_moto_maletas_lista_required CHECK (((NOT permite_variante_maletas) OR ((precio_lista_con_maletas IS NOT NULL) AND (precio_lista_con_maletas >= (0)::numeric)))),
    CONSTRAINT chk_moto_maletas_precio_required CHECK (((NOT permite_variante_maletas) OR ((precio_con_maletas IS NOT NULL) AND (precio_con_maletas >= (0)::numeric)))),
    CONSTRAINT chk_moto_orden_carrusel_gte_1 CHECK ((orden_carrusel >= 1)),
    CONSTRAINT chk_moto_precio_gte_0 CHECK ((precio >= (0)::numeric)),
    CONSTRAINT chk_moto_precio_lista_gte_0 CHECK ((precio_lista >= (0)::numeric)),
    CONSTRAINT motos_moto_orden_carrusel_check CHECK ((orden_carrusel >= 0))
);


--
-- Name: motos_moto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_moto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_moto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_seccionfichatecnica; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_seccionfichatecnica (
    id bigint NOT NULL,
    nombre character varying(120) NOT NULL,
    orden integer NOT NULL,
    moto_id bigint NOT NULL,
    CONSTRAINT motos_seccionfichatecnica_orden_check CHECK ((orden >= 0))
);


--
-- Name: motos_seccionfichatecnica_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_seccionfichatecnica ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_seccionfichatecnica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_tipoatributo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_tipoatributo (
    id bigint NOT NULL,
    nombre character varying(120) NOT NULL,
    slug character varying(50) NOT NULL,
    orden integer NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT motos_tipoatributo_orden_check CHECK ((orden >= 0))
);


--
-- Name: motos_tipoatributo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_tipoatributo ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_tipoatributo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motos_valoratributomoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motos_valoratributomoto (
    id bigint NOT NULL,
    valor text NOT NULL,
    orden integer NOT NULL,
    moto_id bigint NOT NULL,
    tipo_atributo_id bigint NOT NULL,
    nombre character varying(120) NOT NULL,
    tipo_control character varying(20) NOT NULL,
    CONSTRAINT chk_valoratributo_orden_gte_1 CHECK ((orden >= 1)),
    CONSTRAINT motos_valoratributomoto_orden_check CHECK ((orden >= 0))
);


--
-- Name: motos_valoratributomoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.motos_valoratributomoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.motos_valoratributomoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productos_compatibilidadproductomoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos_compatibilidadproductomoto (
    id bigint NOT NULL,
    moto_id bigint NOT NULL,
    producto_id bigint NOT NULL
);


--
-- Name: productos_compatibilidadproductomoto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.productos_compatibilidadproductomoto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.productos_compatibilidadproductomoto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productos_especificacionproducto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos_especificacionproducto (
    id bigint NOT NULL,
    clave character varying(100) NOT NULL,
    valor character varying(255) NOT NULL,
    producto_id bigint NOT NULL,
    CONSTRAINT chk_especprod_clave_not_empty CHECK ((NOT ((clave)::text = ''::text)))
);


--
-- Name: productos_especificacionproducto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.productos_especificacionproducto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.productos_especificacionproducto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productos_imagenproducto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos_imagenproducto (
    id bigint NOT NULL,
    imagen character varying(100) NOT NULL,
    texto_alternativo character varying(255) NOT NULL,
    orden integer NOT NULL,
    producto_id bigint NOT NULL,
    CONSTRAINT chk_imagenprod_orden_gte_0 CHECK ((orden >= 0))
);


--
-- Name: productos_imagenproducto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.productos_imagenproducto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.productos_imagenproducto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productos_producto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos_producto (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    slug character varying(50) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(12,2) NOT NULL,
    imagen_principal character varying(100),
    es_destacado boolean NOT NULL,
    activo boolean NOT NULL,
    requiere_compatibilidad boolean NOT NULL,
    fecha_creacion timestamp with time zone NOT NULL,
    marca_id bigint,
    subcategoria_id bigint NOT NULL,
    orden_carrusel integer NOT NULL,
    CONSTRAINT chk_producto_orden_gte_1 CHECK ((orden_carrusel >= 1)),
    CONSTRAINT chk_producto_precio_gte_0 CHECK ((precio >= (0)::numeric)),
    CONSTRAINT productos_producto_orden_carrusel_check CHECK ((orden_carrusel >= 0))
);


--
-- Name: productos_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.productos_producto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.productos_producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_blacklistedtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_blacklistedtoken (
    id bigint NOT NULL,
    blacklisted_at timestamp with time zone NOT NULL,
    token_id bigint NOT NULL
);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_blacklistedtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_blacklistedtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_outstandingtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_outstandingtoken (
    id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id integer,
    jti character varying(255) NOT NULL
);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_outstandingtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_outstandingtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: analitica_catalogoevento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analitica_catalogoevento (id, created_at, tipo_evento, tipo_entidad, entidad_id, entidad_slug, entidad_nombre, session_id, ip_address, user_agent, origen, metadata, usuario_id) FROM stdin;
1	2026-04-02 16:00:35.155014+00	view_detail	moto	10	ds800x-rally	DS800X-RALLY	sess_1774534930997_vbshmswknb	186.189.71.240	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds800x-rally	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
2	2026-04-02 16:12:54.614063+00	view_detail	moto	11	ds900x	DS900X	sess_1774882005107_ibm9p8ck53	181.161.114.88	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	/motos/ds900x	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
3	2026-04-02 16:13:29.056115+00	view_detail	moto	11	ds900x	DS900X	sess_1775146408905_kxa0b5gb20	181.161.114.88	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	/motos/ds900x	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
4	2026-04-02 16:13:55.150775+00	view_detail	moto	11	ds900x	DS900X	sess_1774391978030_txiycck7n7	181.161.114.88	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds900x	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
5	2026-04-02 17:05:27.307666+00	view_detail	indumentaria	38	casco-airoh-bandit-horn-blanco-brillo	Casco AIROH Bandit Horn Blanco Brillo	sess_1775149527167_tk5rr4o2rz	179.56.131.159	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	/productos/casco-airoh-bandit-horn-blanco-brillo	{"marca": "AIROH", "categoria": "Cascos"}	\N
6	2026-04-02 17:06:40.127627+00	view_detail	indumentaria	38	casco-airoh-bandit-horn-blanco-brillo	Casco AIROH Bandit Horn Blanco Brillo	sess_1775149527167_tk5rr4o2rz	179.56.131.159	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	/productos/casco-airoh-bandit-horn-blanco-brillo	{"marca": "AIROH", "categoria": "Cascos"}	\N
7	2026-04-02 17:21:25.784296+00	view_detail	moto	17	rr660s	RR660S	sess_1774372456687_uory8knign	181.42.209.204	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/rr660s	{"marca": "VOGE", "categoria": "SPORT"}	\N
8	2026-04-02 17:39:50.570638+00	view_detail	moto	10	ds800x-rally	DS800X-RALLY	sess_1774534930997_vbshmswknb	186.189.71.84	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds800x-rally	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
9	2026-04-02 19:47:30.27831+00	view_detail	moto	10	ds800x-rally	DS800X-RALLY	sess_1774534930997_vbshmswknb	190.164.90.17	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds800x-rally	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
10	2026-04-02 20:14:50.866131+00	view_detail	moto	9	ds625x	DS625X	sess_1774534930997_vbshmswknb	186.189.71.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds625x	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
11	2026-04-02 20:15:20.035794+00	view_detail	moto	11	ds900x	DS900X	sess_1774534930997_vbshmswknb	186.189.71.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds900x	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
12	2026-04-02 21:57:01.881764+00	view_detail	indumentaria	5	casco-airoh-matryx-rocket-azul-rojo-brillo	Casco AIROH Matryx Rocket Azul/Rojo Brillo	sess_1774882062619_3wm1ld0r5o	181.232.150.179	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	/productos/casco-airoh-matryx-rocket-azul-rojo-brillo	{"marca": "AIROH", "categoria": "Cascos"}	\N
13	2026-04-03 00:55:27.417818+00	view_detail	moto	15	250rr	250RR	sess_1775177726907_z3pbuhv8g1	181.226.203.172	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/250rr	{"marca": "VOGE", "categoria": "SPORT"}	\N
14	2026-04-03 00:56:12.981324+00	view_detail	moto	10	ds800x-rally	DS800X-RALLY	sess_1775177726907_z3pbuhv8g1	181.226.203.172	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	/motos/ds800x-rally	{"marca": "VOGE", "categoria": "ADVENTURE"}	\N
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	3	add_permission
6	Can change permission	3	change_permission
7	Can delete permission	3	delete_permission
8	Can view permission	3	view_permission
9	Can add group	2	add_group
10	Can change group	2	change_group
11	Can delete group	2	delete_group
12	Can view group	2	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add categoria moto	7	add_categoriamoto
26	Can change categoria moto	7	change_categoriamoto
27	Can delete categoria moto	7	delete_categoriamoto
28	Can view categoria moto	7	view_categoriamoto
29	Can add categoria producto	8	add_categoriaproducto
30	Can change categoria producto	8	change_categoriaproducto
31	Can delete categoria producto	8	delete_categoriaproducto
32	Can view categoria producto	8	view_categoriaproducto
33	Can add marca	9	add_marca
34	Can change marca	9	change_marca
35	Can delete marca	9	delete_marca
36	Can view marca	9	view_marca
37	Can add subcategoria producto	10	add_subcategoriaproducto
38	Can change subcategoria producto	10	change_subcategoriaproducto
39	Can delete subcategoria producto	10	delete_subcategoriaproducto
40	Can view subcategoria producto	10	view_subcategoriaproducto
41	Can add moto	13	add_moto
42	Can change moto	13	change_moto
43	Can delete moto	13	delete_moto
44	Can view moto	13	view_moto
45	Can add imagen moto	12	add_imagenmoto
46	Can change imagen moto	12	change_imagenmoto
47	Can delete imagen moto	12	delete_imagenmoto
48	Can view imagen moto	12	view_imagenmoto
49	Can add especificacion moto	11	add_especificacionmoto
50	Can change especificacion moto	11	change_especificacionmoto
51	Can delete especificacion moto	11	delete_especificacionmoto
52	Can view especificacion moto	11	view_especificacionmoto
53	Can add producto	17	add_producto
54	Can change producto	17	change_producto
55	Can delete producto	17	delete_producto
56	Can view producto	17	view_producto
57	Can add imagen producto	16	add_imagenproducto
58	Can change imagen producto	16	change_imagenproducto
59	Can delete imagen producto	16	delete_imagenproducto
60	Can view imagen producto	16	view_imagenproducto
61	Can add especificacion producto	15	add_especificacionproducto
62	Can change especificacion producto	15	change_especificacionproducto
63	Can delete especificacion producto	15	delete_especificacionproducto
64	Can view especificacion producto	15	view_especificacionproducto
65	Can add Compatibilidad de producto con moto	14	add_compatibilidadproductomoto
66	Can change Compatibilidad de producto con moto	14	change_compatibilidadproductomoto
67	Can delete Compatibilidad de producto con moto	14	delete_compatibilidadproductomoto
68	Can view Compatibilidad de producto con moto	14	view_compatibilidadproductomoto
69	Can add Contacto del sitio	18	add_contactositio
70	Can change Contacto del sitio	18	change_contactositio
71	Can delete Contacto del sitio	18	delete_contactositio
72	Can view Contacto del sitio	18	view_contactositio
73	Can add contacto cliente	19	add_contactocliente
74	Can change contacto cliente	19	change_contactocliente
75	Can delete contacto cliente	19	delete_contactocliente
76	Can view contacto cliente	19	view_contactocliente
77	Can add Token	20	add_token
78	Can change Token	20	change_token
79	Can delete Token	20	delete_token
80	Can view Token	20	view_token
81	Can add Token	21	add_tokenproxy
82	Can change Token	21	change_tokenproxy
83	Can delete Token	21	delete_tokenproxy
84	Can view Token	21	view_tokenproxy
85	Can add Blacklisted Token	22	add_blacklistedtoken
86	Can change Blacklisted Token	22	change_blacklistedtoken
87	Can delete Blacklisted Token	22	delete_blacklistedtoken
88	Can view Blacklisted Token	22	view_blacklistedtoken
89	Can add Outstanding Token	23	add_outstandingtoken
90	Can change Outstanding Token	23	change_outstandingtoken
91	Can delete Outstanding Token	23	delete_outstandingtoken
92	Can view Outstanding Token	23	view_outstandingtoken
93	Can add perfil usuario	24	add_perfilusuario
94	Can change perfil usuario	24	change_perfilusuario
95	Can delete perfil usuario	24	delete_perfilusuario
96	Can view perfil usuario	24	view_perfilusuario
97	Can add mantencion	25	add_mantencion
98	Can change mantencion	25	change_mantencion
99	Can delete mantencion	25	delete_mantencion
100	Can view mantencion	25	view_mantencion
101	Can add vehiculo de cliente	26	add_vehiculocliente
102	Can change vehiculo de cliente	26	change_vehiculocliente
103	Can delete vehiculo de cliente	26	delete_vehiculocliente
104	Can view vehiculo de cliente	26	view_vehiculocliente
105	Can add modelo moto	27	add_modelomoto
106	Can change modelo moto	27	change_modelomoto
107	Can delete modelo moto	27	delete_modelomoto
108	Can view modelo moto	27	view_modelomoto
109	Can add horario operativo de mantencion	28	add_horariomantencion
110	Can change horario operativo de mantencion	28	change_horariomantencion
111	Can delete horario operativo de mantencion	28	delete_horariomantencion
112	Can view horario operativo de mantencion	28	view_horariomantencion
113	Can add historial de estado de mantencion	29	add_mantencionestadohistorial
114	Can change historial de estado de mantencion	29	change_mantencionestadohistorial
115	Can delete historial de estado de mantencion	29	delete_mantencionestadohistorial
116	Can view historial de estado de mantencion	29	view_mantencionestadohistorial
117	Can add evento de catalogo	30	add_catalogoevento
118	Can change evento de catalogo	30	change_catalogoevento
119	Can delete evento de catalogo	30	delete_catalogoevento
120	Can view evento de catalogo	30	view_catalogoevento
121	Can add seccion ficha tecnica	32	add_seccionfichatecnica
122	Can change seccion ficha tecnica	32	change_seccionfichatecnica
123	Can delete seccion ficha tecnica	32	delete_seccionfichatecnica
124	Can view seccion ficha tecnica	32	view_seccionfichatecnica
125	Can add item ficha tecnica	31	add_itemfichatecnica
126	Can change item ficha tecnica	31	change_itemfichatecnica
127	Can delete item ficha tecnica	31	delete_itemfichatecnica
128	Can view item ficha tecnica	31	view_itemfichatecnica
129	Can add tipo atributo	33	add_tipoatributo
130	Can change tipo atributo	33	change_tipoatributo
131	Can delete tipo atributo	33	delete_tipoatributo
132	Can view tipo atributo	33	view_tipoatributo
133	Can add valor atributo moto	34	add_valoratributomoto
134	Can change valor atributo moto	34	change_valoratributomoto
135	Can delete valor atributo moto	34	delete_valoratributomoto
136	Can view valor atributo moto	34	view_valoratributomoto
137	Can add dia bloqueado de mantencion	35	add_mantenciondiabloqueado
138	Can change dia bloqueado de mantencion	35	change_mantenciondiabloqueado
139	Can delete dia bloqueado de mantencion	35	delete_mantenciondiabloqueado
140	Can view dia bloqueado de mantencion	35	view_mantenciondiabloqueado
141	Can add horario por fecha de mantencion	37	add_mantencionhorariofecha
142	Can change horario por fecha de mantencion	37	change_mantencionhorariofecha
143	Can delete horario por fecha de mantencion	37	delete_mantencionhorariofecha
144	Can view horario por fecha de mantencion	37	view_mantencionhorariofecha
145	Can add hora bloqueada de mantencion	36	add_mantencionhorabloqueada
146	Can change hora bloqueada de mantencion	36	change_mantencionhorabloqueada
147	Can delete hora bloqueada de mantencion	36	delete_mantencionhorabloqueada
148	Can view hora bloqueada de mantencion	36	view_mantencionhorabloqueada
149	Can add audit log	38	add_auditlog
150	Can change audit log	38	change_auditlog
151	Can delete audit log	38	delete_auditlog
152	Can view audit log	38	view_auditlog
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
2	pbkdf2_sha256$1200000$xVohlLlIyY8M7NHolc3TFS$/J5XcofDV1IkMFMFUdZE9RkAUjDDyWsvIZRoaUzbGQw=	\N	t	mundaca				t	t	2026-03-16 11:19:11.007894+00
4	!vmQNLjKrvve4F0VcqJWMnozajfabNslMGxhhLma5	\N	f	cristobalmundaca759625	Cristobal	Mundaca		f	t	2026-03-18 01:18:58.269228+00
5	!MSm3hSvEKjrZguyl6ZdQQFC0G5nRAPIzxajiQ9pD	\N	f	mundaca759625	mundaca			f	t	2026-03-18 01:38:24.902456+00
6	!4XjXCkdTttd8jWu0XvzqIWa23MSKal6ni7DXKkR0	\N	f	mundaca7596252	mundaca			f	t	2026-03-18 02:24:24.228007+00
7	!KfEhRg4q9kte0skB20ggReFMQcf72zDk1r0llPnE	\N	f	cristobalmundacavergara123	Cristobal	Mundaca	cristobalmundacavergara123@gmail.com	f	t	2026-03-19 13:30:42.690906+00
8	!AJvummH3avbfXNTPfikTOgBScyvBJoqtcTtBmaE2	\N	f	cdelanoe2	Claudio	Delanoe	cdelanoe@gmail.com	f	t	2026-03-19 13:55:04.635182+00
9	!XqZMhfRXteqZqv9l7QL4w6wxgkqi35YR2O9D3F9Z	\N	f	msalvo	Morelia	Salvo	msalvo@gmail.com	f	t	2026-03-19 14:00:57.148036+00
16	!6umPieoSeC6ZBiZ6XRYP4W6OxYg9IAKJcBQb4Xko	\N	f	cristobalmundacavergara	Cristobal	Mundaca	cristobalmundacavergara@gmail.com	f	t	2026-03-19 14:53:27.014547+00
17		\N	f	seed_cliente_1	Cliente1	Dashboard	seed_cliente_1@example.com	f	t	2026-03-20 00:19:32.391743+00
18		\N	f	seed_cliente_2	Cliente2	Dashboard	seed_cliente_2@example.com	f	t	2026-03-20 00:19:32.396652+00
19		\N	f	seed_cliente_3	Cliente3	Dashboard	seed_cliente_3@example.com	f	t	2026-03-20 00:19:32.398392+00
20		\N	f	seed_cliente_4	Cliente4	Dashboard	seed_cliente_4@example.com	f	t	2026-03-20 00:19:32.400071+00
21		\N	f	seed_cliente_5	Cliente5	Dashboard	seed_cliente_5@example.com	f	t	2026-03-20 00:19:32.402219+00
22		\N	f	seed_cliente_6	Cliente6	Dashboard	seed_cliente_6@example.com	f	t	2026-03-20 00:19:32.403936+00
23		\N	f	seed_cliente_7	Cliente7	Dashboard	seed_cliente_7@example.com	f	t	2026-03-20 00:19:32.405649+00
24		\N	f	seed_cliente_8	Cliente8	Dashboard	seed_cliente_8@example.com	f	t	2026-03-20 00:19:32.407404+00
26	!Bm4LJscKFL4OZNzHRMNAsrIHDLnTYQE4kWR7wWuI	\N	f	crism	Cristobal	Mundaca	crism@gmail.com	f	t	2026-03-24 00:50:58.680716+00
27	pbkdf2_sha256$1200000$OkHoMkbIpmEF8annghbmSc$v3nEXVNeZGpm3KnjgDKCpNMxrb4ngRvRLUuaEfGLCr0=	\N	f	JEANOFT	Jean	Echevarria	jeancarlosecheverria@gmail.com	f	t	2026-03-24 20:10:35.129294+00
29	pbkdf2_sha256$1200000$Cn98mnKTW3IDadN6VsnqD3$/GhkQ2gHidyuksjgT5xiBGjIj6z9TB17C7N5cF4uYRY=	\N	f	ivergara	Ignacio	Vergara	ivergara@gmail.com	f	t	2026-03-30 14:08:32.126921+00
1	pbkdf2_sha256$1200000$O5gEgjeo7uBGI1y8VlFQ5w$5fVSn2qqb2XAKZ9f2JJQezfw0vKoTKidEIOAD/icbek=	\N	f	cmundaca	Cristobal	Mundaca	cristobalmundacavergara@gmail.com	f	t	2026-03-15 14:25:00.10719+00
31	!VpXuuvZAheEInVrjXYJlyiAZEugvY48hEzhKukU3	\N	f	__cliente_invitado__	Cliente	Invitado		f	f	2026-04-01 02:11:58.279021+00
3	pbkdf2_sha256$1200000$oDcRAhQh6sP0cbFnj2ZAGJ$ct9QA0g4p9pkEiO20eSV3jPSIxb8wdcM5WLcgkuHfEs=	\N	f	cdelanoe	Claudio	Delanoe	claudio.delanoe@gmail.com	t	t	2026-03-16 21:37:36.042812+00
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
a5cca81ad241f6823e4c69f354096ebe28714a1c	2026-03-15 14:25:01.221238+00	1
\.


--
-- Data for Name: catalogo_categoriamoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalogo_categoriamoto (id, nombre, slug, descripcion, activa) FROM stdin;
2	SPORT	sport		t
3	DUAL SPORT	dual-sport		t
5	SCOOTER	scooter		t
6	CRUISER	cruiser		t
1	NAKED	naked		t
4	ADVENTURE	adventure		t
\.


--
-- Data for Name: catalogo_categoriaproducto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalogo_categoriaproducto (id, nombre, slug, descripcion, activa) FROM stdin;
1	Accesorios Motos	accesorios-para-la-moto		t
2	Indumentaria Rider	indumentaria-rider		t
\.


--
-- Data for Name: catalogo_marca; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalogo_marca (id, nombre, slug, url_logo, descripcion, activa, tipo) FROM stdin;
4	4RS	4rs			t	accesorio_moto
2	AIROH	airoh			t	accesorio_rider
5	BELTA	belta			t	accesorio_moto
8	HRO	hro			t	accesorio_rider
9	ICH	ich			t	accesorio_rider
7	MOTOCENTRIC	motocentric			t	accesorio_moto
6	RHINOWALK	rhinowalk			t	accesorio_moto
3	SHAFT	shaft			t	accesorio_rider
1	VOGE	voge			t	moto
\.


--
-- Data for Name: catalogo_subcategoriaproducto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalogo_subcategoriaproducto (id, nombre, slug, descripcion, activa, categoria_id) FROM stdin;
1	Rampla	rampla		t	1
2	Soportes	soportes		t	1
3	Bolsos	bolsos		t	1
4	Maletas	maletas		t	1
5	Manos libres e Intercomunicadores	manos-libres-e-intercomunicadores		t	2
6	Guantes	guantes		t	2
7	Chaquetas	chaquetas		t	2
8	Pantalones	pantalones		t	2
9	Botas	botas		t	2
10	Protecciones	protecciones		t	2
11	Mascaras	mascaras		t	2
12	Bolsos y Mochilas	bolsos-y-mochilas		t	2
13	Antiparras	antiparras		t	2
14	Para Ellas	para-ellas		t	2
15	Mas Accesorios	mas-accesorios		t	2
16	Cascos	cascos		t	2
\.


--
-- Data for Name: clientes_contactocliente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clientes_contactocliente (id, telefono, email, mensaje, fecha_creacion, moto_id, producto_id, nombres, apellidos) FROM stdin;
\.


--
-- Data for Name: clientes_perfilusuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clientes_perfilusuario (id, telefono, rol, user_id) FROM stdin;
2	+569 4875 9625	cliente	4
3	+569 4875 9625	cliente	5
4	+569 4875 9625	cliente	6
5	+569 4875 9625	cliente	7
6	+56978451296	cliente	8
7	+56978451296	cliente	9
16	+569 4875 9625	cliente	26
17		superadmin	2
18		cliente	27
14	+56966635509	cliente	16
20		cliente	29
21	+5696663520	cliente	1
1	+56948759625	admin	3
\.


--
-- Data for Name: core_auditlog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.core_auditlog (id, creado_en, request_id, entidad, entidad_id, accion, before, after, metadata, actor_id) FROM stdin;
1	2026-03-29 18:22:06.04077+00	5d56132e-0276-4b93-8155-7bacfccb298c	motos.Moto	2	delete	{"id": 2, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 5, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "8490000.00", "fecha_creacion": "2026-03-16T00:01:32.294866+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	\N	{"path": "/api/motos/2/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
2	2026-03-29 18:23:48.148526+00	658cd83b-abdd-4e2d-bf9f-14b8e833aae1	motos.Moto	17	create	\N	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
3	2026-03-29 18:27:06.680128+00	fee4c07e-c4a2-41ce-bcfa-668310afdaa7	motos.ValorAtributoMoto	1693	update	{"id": 1693, "moto": 17, "orden": 1, "valor": "", "nombre": "Tipo", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1693, "moto": 17, "orden": 1, "valor": "Motor de 4 cilindros en línea, 16 válvulas y doble árbol de levas (DOHC)", "nombre": "Tipo", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1693/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
4	2026-03-29 18:27:06.896273+00	2702a0cd-ca15-4432-b100-e0ea94101254	motos.ValorAtributoMoto	1694	update	{"id": 1694, "moto": 17, "orden": 2, "valor": "", "nombre": "Refrigeracion", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1694, "moto": 17, "orden": 2, "valor": "Líquida", "nombre": "Refrigeracion", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1694/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
5	2026-03-29 18:27:07.111914+00	c95a4b0d-7346-46ab-8b78-2cb8e5e69a5f	motos.ValorAtributoMoto	1695	update	{"id": 1695, "moto": 17, "orden": 3, "valor": "", "nombre": "Alimentacion", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1695, "moto": 17, "orden": 3, "valor": "EFI inyección electrónica", "nombre": "Alimentacion", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1695/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
6	2026-03-29 18:27:07.330259+00	5a932282-1520-44a9-9f3a-d953f3733a8a	motos.ValorAtributoMoto	1696	update	{"id": 1696, "moto": 17, "orden": 4, "valor": "", "nombre": "Diametro x carrera", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1696, "moto": 17, "orden": 4, "valor": "67 mm x 47 mm", "nombre": "Diametro x carrera", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1696/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
7	2026-03-29 18:27:07.54474+00	0ba9d219-28dd-4af3-982a-03ed2e598358	motos.ValorAtributoMoto	1697	update	{"id": 1697, "moto": 17, "orden": 5, "valor": "", "nombre": "Cilindrada", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1697, "moto": 17, "orden": 5, "valor": "662,8 cc", "nombre": "Cilindrada", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1697/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
8	2026-03-29 18:27:07.761699+00	83aef91a-7522-487b-803a-831c9adec787	motos.ValorAtributoMoto	1698	update	{"id": 1698, "moto": 17, "orden": 6, "valor": "", "nombre": "Relacion de compresion", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1698, "moto": 17, "orden": 6, "valor": "11,8:1", "nombre": "Relacion de compresion", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1698/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
9	2026-03-29 18:27:07.981619+00	743e66ae-d952-457f-97ee-45690f777070	motos.ValorAtributoMoto	1699	update	{"id": 1699, "moto": 17, "orden": 7, "valor": "", "nombre": "Potencia Maxima", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1699, "moto": 17, "orden": 7, "valor": "99 HP (74 kW) / 11500 rpm", "nombre": "Potencia Maxima", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1699/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
87	2026-03-31 21:41:04.568518+00	26a4cb83-0c5d-4e1d-81b1-3cab1bceb5fc	catalogo.SubcategoriaProducto	20	create	\N	{"id": 20, "slug": "mda-categoria", "activa": true, "nombre": "Mda Categoria", "categoria": 2, "descripcion": ""}	{"path": "/api/catalogo/accesorios-rider/categorias/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
10	2026-03-29 18:27:08.226827+00	d1f862ca-fff0-4fba-9f4b-ed56c2507b21	motos.ValorAtributoMoto	1700	update	{"id": 1700, "moto": 17, "orden": 8, "valor": "", "nombre": "Par maximo", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1700, "moto": 17, "orden": 8, "valor": "64 Nm / 10000 rpm", "nombre": "Par maximo", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1700/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
11	2026-03-29 18:27:08.441992+00	d09a51bb-7588-49b0-aae7-3efe499c5b58	motos.ValorAtributoMoto	1701	update	{"id": 1701, "moto": 17, "orden": 9, "valor": "", "nombre": "Embrague", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1701, "moto": 17, "orden": 9, "valor": "Tipo antirrebote", "nombre": "Embrague", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1701/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
12	2026-03-29 18:27:08.654032+00	4da041db-d33f-4e12-a1e6-933e806fdc0f	motos.ValorAtributoMoto	1702	update	{"id": 1702, "moto": 17, "orden": 10, "valor": "", "nombre": "Cambio", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1702, "moto": 17, "orden": 10, "valor": "6 velocidades", "nombre": "Cambio", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1702/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
13	2026-03-29 18:27:08.898497+00	b895295f-e337-46f2-bfca-a1429acc220a	motos.ValorAtributoMoto	1703	update	{"id": 1703, "moto": 17, "orden": 11, "valor": "", "nombre": "Consumo homologado", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1703, "moto": 17, "orden": 11, "valor": "5,5L/100km", "nombre": "Consumo homologado", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1703/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
14	2026-03-29 18:27:09.142902+00	fb173e5b-86ee-4fa3-a42b-1689063d1eb3	motos.ValorAtributoMoto	1704	update	{"id": 1704, "moto": 17, "orden": 12, "valor": "", "nombre": "Bateria", "tipo_control": "texto", "tipo_atributo": 1}	{"id": 1704, "moto": 17, "orden": 12, "valor": "12V 10AH", "nombre": "Bateria", "tipo_control": "texto", "tipo_atributo": 1}	{"path": "/api/motos/ficha/valores/1704/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
15	2026-03-29 18:27:09.378043+00	a5ad3461-8f71-46b1-8d3a-a64710285441	motos.ValorAtributoMoto	1705	update	{"id": 1705, "moto": 17, "orden": 1, "valor": "", "nombre": "Chasis", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1705, "moto": 17, "orden": 1, "valor": "Perimetral de acero", "nombre": "Chasis", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1705/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
16	2026-03-29 18:27:09.593441+00	ff0d46b1-f5be-4f7a-8e1c-155d133812db	motos.ValorAtributoMoto	1706	update	{"id": 1706, "moto": 17, "orden": 2, "valor": "", "nombre": "Suspension delantera", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1706, "moto": 17, "orden": 2, "valor": "Horquilla invertida KYB de 43 mm", "nombre": "Suspension delantera", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1706/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
17	2026-03-29 18:27:09.814028+00	e4e30d92-bea9-4ddc-88db-1bce6e409c24	motos.ValorAtributoMoto	1707	update	{"id": 1707, "moto": 17, "orden": 3, "valor": "", "nombre": "Suspension trasera", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1707, "moto": 17, "orden": 3, "valor": "Monoamortiguador central", "nombre": "Suspension trasera", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1707/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
18	2026-03-29 18:27:10.023159+00	babbc50c-2eb9-4d24-9b6d-2468a7532c7d	motos.ValorAtributoMoto	1708	update	{"id": 1708, "moto": 17, "orden": 4, "valor": "", "nombre": "Neumatico delantero", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1708, "moto": 17, "orden": 4, "valor": "120/70 ZR17", "nombre": "Neumatico delantero", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1708/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
19	2026-03-29 18:27:10.237478+00	e29177dc-6f37-41e9-a9fa-d778e692f22d	motos.ValorAtributoMoto	1709	update	{"id": 1709, "moto": 17, "orden": 5, "valor": "", "nombre": "Neumatico trasero", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1709, "moto": 17, "orden": 5, "valor": "180/55 ZR17", "nombre": "Neumatico trasero", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1709/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
20	2026-03-29 18:27:10.464911+00	d1c26b09-0e4f-4aa0-bbf6-c340470f9721	motos.ValorAtributoMoto	1710	update	{"id": 1710, "moto": 17, "orden": 6, "valor": "", "nombre": "Freno delantero", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1710, "moto": 17, "orden": 6, "valor": "Doble disco, pinza fija de cuatro pistones, diámetro de disco de 298 mm.", "nombre": "Freno delantero", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1710/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
21	2026-03-29 18:27:10.681565+00	408ac782-6346-47bd-acac-80901a040e54	motos.ValorAtributoMoto	1711	update	{"id": 1711, "moto": 17, "orden": 7, "valor": "", "nombre": "Freno trasero", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1711, "moto": 17, "orden": 7, "valor": "Disco de 240 mm con pinza Nissin de 1 pistón.", "nombre": "Freno trasero", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1711/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
22	2026-03-29 18:27:10.897816+00	4bb5a5fc-2e04-4b23-b2ba-727a12dbb6ed	motos.ValorAtributoMoto	1712	update	{"id": 1712, "moto": 17, "orden": 8, "valor": "", "nombre": "ABS", "tipo_control": "texto", "tipo_atributo": 2}	{"id": 1712, "moto": 17, "orden": 8, "valor": "Doble vía", "nombre": "ABS", "tipo_control": "texto", "tipo_atributo": 2}	{"path": "/api/motos/ficha/valores/1712/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
23	2026-03-29 18:27:11.13694+00	0e85b4d5-3766-4e7b-b0ed-e66cba5c58c0	motos.ValorAtributoMoto	1713	update	{"id": 1713, "moto": 17, "orden": 1, "valor": "", "nombre": "Largo", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1713, "moto": 17, "orden": 1, "valor": "2090 mm", "nombre": "Largo", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1713/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
24	2026-03-29 18:27:11.340088+00	5268da12-8ef8-4945-bcd7-c15a3de489ad	motos.ValorAtributoMoto	1714	update	{"id": 1714, "moto": 17, "orden": 2, "valor": "", "nombre": "Ancho", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1714, "moto": 17, "orden": 2, "valor": "950 mm", "nombre": "Ancho", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1714/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
25	2026-03-29 18:27:11.572586+00	36368e0b-4fe5-41fc-a028-66d8e101bc5f	motos.ValorAtributoMoto	1715	update	{"id": 1715, "moto": 17, "orden": 3, "valor": "", "nombre": "Alto", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1715, "moto": 17, "orden": 3, "valor": "1210 mm", "nombre": "Alto", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1715/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
26	2026-03-29 18:27:11.793608+00	123cad23-66fe-4d6b-bf57-9fedaceb973b	motos.ValorAtributoMoto	1716	update	{"id": 1716, "moto": 17, "orden": 4, "valor": "", "nombre": "Distancia entre ejes", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1716, "moto": 17, "orden": 4, "valor": "1450 mm", "nombre": "Distancia entre ejes", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1716/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
27	2026-03-29 18:27:13.484603+00	b3a72340-e688-4e04-bb1f-f67a3238cc91	motos.ValorAtributoMoto	1717	update	{"id": 1717, "moto": 17, "orden": 5, "valor": "", "nombre": "Distancia al suelo", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1717, "moto": 17, "orden": 5, "valor": "130 mm", "nombre": "Distancia al suelo", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1717/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
28	2026-03-29 18:27:13.697276+00	eb516af8-2f8b-48c7-95b7-fcd9327eea45	motos.ValorAtributoMoto	1718	update	{"id": 1718, "moto": 17, "orden": 6, "valor": "", "nombre": "Altura asiento", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1718, "moto": 17, "orden": 6, "valor": "800 mm Ajustable", "nombre": "Altura asiento", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1718/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
29	2026-03-29 18:27:13.915748+00	5504f4a4-8fbc-4134-9ede-7fa880cb1851	motos.ValorAtributoMoto	1719	update	{"id": 1719, "moto": 17, "orden": 7, "valor": "", "nombre": "Peso neto", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1719, "moto": 17, "orden": 7, "valor": "215 kg", "nombre": "Peso neto", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1719/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
30	2026-03-29 18:27:14.118222+00	3328a725-0e06-4318-81aa-71b976692215	motos.ValorAtributoMoto	1720	update	{"id": 1720, "moto": 17, "orden": 8, "valor": "", "nombre": "Capacidad deposito", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1720, "moto": 17, "orden": 8, "valor": "15,5 L", "nombre": "Capacidad deposito", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1720/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
31	2026-03-29 18:27:14.376959+00	bfdef4ee-84ee-4116-8180-ee7d725f4604	motos.ValorAtributoMoto	1721	update	{"id": 1721, "moto": 17, "orden": 9, "valor": "", "nombre": "Velocidad maxima", "tipo_control": "texto", "tipo_atributo": 3}	{"id": 1721, "moto": 17, "orden": 9, "valor": "235 km/h", "nombre": "Velocidad maxima", "tipo_control": "texto", "tipo_atributo": 3}	{"path": "/api/motos/ficha/valores/1721/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
32	2026-03-29 18:27:14.594349+00	23b69ef8-250b-4aa6-b8d4-59dd82d2797d	motos.ValorAtributoMoto	1755	update	{"id": 1755, "moto": 17, "orden": 1, "valor": "", "nombre": "Iluminacion LED", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1755, "moto": 17, "orden": 1, "valor": "Si", "nombre": "Iluminacion LED", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1755/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
33	2026-03-29 18:27:14.824224+00	e4b883d3-43a3-4306-b429-78c20f13aaea	motos.ValorAtributoMoto	1756	update	{"id": 1756, "moto": 17, "orden": 2, "valor": "", "nombre": "Instrumentacion TFT a color", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1756, "moto": 17, "orden": 2, "valor": "Si", "nombre": "Instrumentacion TFT a color", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1756/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
34	2026-03-29 18:27:15.0614+00	3619cbdf-ff98-453e-b032-bff1c59e40bc	motos.ValorAtributoMoto	1757	update	{"id": 1757, "moto": 17, "orden": 3, "valor": "", "nombre": "Sistema de frenos Brembo y Nissin", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1757, "moto": 17, "orden": 3, "valor": "Si", "nombre": "Sistema de frenos Brembo y Nissin", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1757/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
35	2026-03-29 18:27:15.273762+00	f1dadfcd-08e1-40d5-97dc-d666d1bc8ef8	motos.ValorAtributoMoto	1758	update	{"id": 1758, "moto": 17, "orden": 4, "valor": "", "nombre": "Sistema de control de traccion", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1758, "moto": 17, "orden": 4, "valor": "Si", "nombre": "Sistema de control de traccion", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1758/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
36	2026-03-29 18:27:15.573646+00	c1dc965d-b89d-4eeb-b396-aa7a11f414cb	motos.ValorAtributoMoto	1759	update	{"id": 1759, "moto": 17, "orden": 6, "valor": "", "nombre": "Toma USB", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1759, "moto": 17, "orden": 6, "valor": "Si", "nombre": "Toma USB", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1759/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
37	2026-03-29 18:27:15.789811+00	254cffe7-fa2a-4663-9d50-1f85f3c9eff4	motos.ValorAtributoMoto	1760	update	{"id": 1760, "moto": 17, "orden": 7, "valor": "", "nombre": "Dos modos de conduccion", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1760, "moto": 17, "orden": 7, "valor": "Si", "nombre": "Dos modos de conduccion", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1760/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
38	2026-03-29 18:27:16.002547+00	f38680e1-61b1-43be-8d71-0e730798ede6	motos.ValorAtributoMoto	1761	update	{"id": 1761, "moto": 17, "orden": 8, "valor": "", "nombre": "Computadora de viaje", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1761, "moto": 17, "orden": 8, "valor": "Si", "nombre": "Computadora de viaje", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1761/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
39	2026-03-29 18:27:16.218878+00	34836332-586a-48b9-8ee9-bcdc0485cfbc	motos.ValorAtributoMoto	1762	update	{"id": 1762, "moto": 17, "orden": 9, "valor": "", "nombre": "Launch control", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1762, "moto": 17, "orden": 9, "valor": "Si", "nombre": "Launch control", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1762/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
40	2026-03-29 18:27:16.445492+00	52e17294-833c-43e9-81cd-fd42e34018b8	motos.ValorAtributoMoto	1763	update	{"id": 1763, "moto": 17, "orden": 10, "valor": "", "nombre": "Accionamiento valvula de salida de escape", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1763, "moto": 17, "orden": 10, "valor": "Si", "nombre": "Accionamiento valvula de salida de escape", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1763/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
41	2026-03-29 18:27:16.666382+00	7ed25ead-1410-41df-ac70-6921ff3cf62c	motos.ValorAtributoMoto	1753	update	{"id": 1753, "moto": 17, "orden": 32, "valor": "", "nombre": "Sistema Quick Shift", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1753, "moto": 17, "orden": 32, "valor": "Si", "nombre": "Sistema Quick Shift", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1753/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
42	2026-03-29 18:27:16.884288+00	745bc629-483b-499c-b81c-db8c9e75c710	motos.ValorAtributoMoto	1754	update	{"id": 1754, "moto": 17, "orden": 33, "valor": "", "nombre": "Frenos", "tipo_control": "texto", "tipo_atributo": 4}	{"id": 1754, "moto": 17, "orden": 33, "valor": "Brembo / Nissin", "nombre": "Frenos", "tipo_control": "texto", "tipo_atributo": 4}	{"path": "/api/motos/ficha/valores/1754/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
64	2026-03-31 02:50:24.067463+00	4b6fbdcd-0743-4ddb-8499-01bc1d1ad571	motos.Moto	18	create	\N	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6000000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
43	2026-03-30 00:05:52.62074+00	11aa34fb-d2dd-4a39-a017-23cea5fc99ce	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
44	2026-03-30 00:06:03.527962+00	357fc242-6496-4609-85f6-fad3bf440bec	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
45	2026-03-30 00:06:07.547908+00	5d1ad488-34fb-4dce-a728-d1a8d99b2923	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "stock": 0, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
46	2026-03-30 00:09:42.391446+00	a6cecc8b-b059-4614-9c3e-049e2a37656b	productos.Producto	41	delete	{"id": 41, "slug": "maleta-lateral-motocentric-28l", "marca": 7, "stock": 7, "activo": true, "nombre": "Maleta Lateral MOTOCENTRIC 28L", "precio": "129990.00", "descripcion": "Maleta lateral semirrigida con sistema de anclaje rapido.", "es_destacado": false, "subcategoria": 4, "fecha_creacion": "2026-03-23T21:00:29.333745+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/33.jpg", "requiere_compatibilidad": false}	\N	{"path": "/api/tienda/admin/productos/41/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
47	2026-03-30 18:03:57.374049+00	52729585-bf47-48cc-87c5-7bd608cc916c	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
84	2026-03-31 21:37:50.665977+00	4fdb9c46-2ec1-4596-95cd-a3bccf9f8277	catalogo.Marca	14	delete	{"id": 14, "slug": "daca-sc-asda", "tipo": "accesorio_rider", "activa": true, "nombre": "DACA SC ASDA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/14/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
48	2026-03-30 18:14:55.644595+00	215f3cb3-1f5a-4362-9e02-33d4886e4dfb	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
49	2026-03-30 18:20:41.109894+00	70ba0975-f308-4dbe-94cd-57e88b1569e8	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
50	2026-03-30 18:32:07.680458+00	3d8dc8a6-d1af-4f6e-89b0-3f4380e530c4	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
51	2026-03-30 18:32:18.320362+00	8e147b7c-7833-4ce8-81d1-8cdb2887a0b6	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/rr660s_ZSJhVWg.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
52	2026-03-30 18:33:39.62424+00	474ba9e1-7138-4a47-8e24-128f89c6ed1a	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
85	2026-03-31 21:38:44.372506+00	d207d589-6eca-4941-99e7-d798fd428eb2	productos.Producto	60	delete	{"id": 60, "slug": "producto-inventado", "marca": null, "activo": true, "nombre": "Producto Inventado", "precio": "15000.00", "descripcion": "descripcion inventada para un produccto inventado", "es_destacado": true, "subcategoria": 18, "fecha_creacion": "2026-03-31T21:11:41.832941+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020.jpeg", "requiere_compatibilidad": true}	\N	{"path": "/api/tienda/admin/productos/60/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
53	2026-03-30 18:42:51.544814+00	60329e07-c82f-468d-90a0-c1c0a02693ae	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
54	2026-03-30 18:43:30.43456+00	ad1236a9-8ddc-4199-acb8-ffa4f400231f	motos.Moto	17	update	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 17, "anio": 2026, "slug": "rr660s", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "RR660S", "precio": "8490000.00", "descripcion": "La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.", "modelo_moto": 2, "es_destacada": true, "precio_lista": "9090000.00", "fecha_creacion": "2026-03-29T18:23:47.741805+00:00", "orden_carrusel": 1, "imagen_principal": "motos/2560.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36", "remote_addr": "127.0.0.1", "query_string": ""}	2
55	2026-03-31 02:05:14.381165+00	e65a474c-9051-4f13-856f-372754257d21	catalogo.Marca	10	create	\N	{"id": 10, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=moto"}	2
56	2026-03-31 02:05:21.497599+00	9c1a108a-2334-45da-a798-010497a2b963	catalogo.Marca	10	update	{"id": 10, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	{"id": 10, "slug": "hondas", "tipo": "moto", "activa": true, "nombre": "HONDAS", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/10/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
57	2026-03-31 02:05:25.17663+00	8896651b-ce5a-4767-a239-78a8e8726449	catalogo.Marca	10	update	{"id": 10, "slug": "hondas", "tipo": "moto", "activa": true, "nombre": "HONDAS", "url_logo": "", "descripcion": ""}	{"id": 10, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/10/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
58	2026-03-31 02:05:27.338768+00	7d59c1eb-6dc3-46d5-ad0d-d55b7dc2e5ec	catalogo.Marca	10	delete	{"id": 10, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/10/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
59	2026-03-31 02:05:45.243+00	b04b1b3d-225b-4ee5-85c8-4e7723de99a6	catalogo.Marca	11	create	\N	{"id": 11, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=moto"}	2
60	2026-03-31 02:06:15.168074+00	3ef51cab-3ed0-4d8e-8e4e-ea5e6c07d96c	catalogo.CategoriaMoto	7	create	\N	{"id": 7, "slug": "super-sport", "activa": true, "nombre": "Super Sport", "descripcion": ""}	{"path": "/api/motos/categorias/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
61	2026-03-31 02:36:18.693832+00	9dc7f7ce-4b9d-42a6-936d-11674f949aa8	catalogo.SubcategoriaProducto	17	create	\N	{"id": 17, "slug": "categoria-prueba-1", "activa": true, "nombre": "Categoria Prueba 1", "categoria": 2, "descripcion": ""}	{"path": "/api/catalogo/accesorios-rider/categorias/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
62	2026-03-31 02:36:24.14196+00	ccf8eead-86c3-4df2-b67c-976c722c47a3	catalogo.SubcategoriaProducto	17	update	{"id": 17, "slug": "categoria-prueba-1", "activa": true, "nombre": "Categoria Prueba 1", "categoria": 2, "descripcion": ""}	{"id": 17, "slug": "categoria-prueba-2", "activa": true, "nombre": "Categoria Prueba 2", "categoria": 2, "descripcion": ""}	{"path": "/api/catalogo/accesorios-rider/categorias/17/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
63	2026-03-31 02:49:28.978233+00	cdafdffc-d6bf-4892-9409-7ef7c146992e	motos.ModeloMoto	16	create	\N	{"id": 16, "peso": null, "slug": "cbr650r", "marca": 11, "activo": true, "torque": null, "potencia": null, "categoria": 7, "cilindrada": null, "tipo_motor": "", "descripcion": "", "transmision": "", "nombre_modelo": "CBR650R", "refrigeracion": "", "capacidad_estanque": null}	{"path": "/api/motos/modelos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
86	2026-03-31 21:40:54.644332+00	d74c66aa-2e34-4b7c-bd70-cfe6e12c3223	catalogo.Marca	15	create	\N	{"id": 15, "slug": "mda", "tipo": "accesorio_rider", "activa": true, "nombre": "MDA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=accesorio_rider"}	2
65	2026-03-31 02:50:33.801352+00	3bc326b7-2c08-4cca-9eb7-f830dca180f4	motos.Moto	18	update	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6000000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6500000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/18/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
66	2026-03-31 02:51:01.473619+00	bb4879ec-95a7-4571-97a9-85c7e5190321	motos.Moto	18	update	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6500000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "65000000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/18/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
67	2026-03-31 02:51:26.115766+00	4277a11d-db46-4bda-b0cc-2b73d9797df7	motos.Moto	18	update	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "65000000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6500000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/18/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
68	2026-03-31 02:53:55.95819+00	efaaeca7-5f80-4a58-8acb-b0eb78def1cb	motos.Moto	18	delete	{"id": 18, "anio": 2026, "slug": "cbr650r", "color": "", "marca": 11, "activa": true, "estado": "disponible", "modelo": "CBR650R", "precio": "5000000.00", "descripcion": "Esta descripcion es una descripcion inventada para el smoke test antes de produccion", "modelo_moto": 16, "es_destacada": false, "precio_lista": "6500000.00", "fecha_creacion": "2026-03-31T02:50:23.658591+00:00", "orden_carrusel": 1, "imagen_principal": "motos/CBR-650R-2024-nueva.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	\N	{"path": "/api/motos/18/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
69	2026-03-31 03:01:50.792943+00	3a1586e1-6cec-40da-948f-b6685dd776c2	productos.Producto	59	create	\N	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke test", "es_destacado": false, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/accesorios-rider/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
70	2026-03-31 03:02:00.994441+00	57c91650-378b-4aa1-a38a-2ce087a72614	productos.Producto	59	update	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke test", "es_destacado": false, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke test", "es_destacado": true, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/59/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
71	2026-03-31 03:02:15.647814+00	7136caaa-f34e-4476-9736-72c20078f9a8	productos.Producto	59	update	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke test", "es_destacado": true, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke", "es_destacado": true, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/59/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
72	2026-03-31 03:03:52.373252+00	7722d8ed-6a99-4c45-b66a-f99e7ef62a40	productos.Producto	59	delete	{"id": 59, "slug": "antiparras-test", "marca": 2, "activo": true, "nombre": "Antiparras Test", "precio": "15000.00", "descripcion": "smoke", "es_destacado": true, "subcategoria": 13, "fecha_creacion": "2026-03-31T03:01:50.765630+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/CBR-1000-RRR-honda.webp", "requiere_compatibilidad": false}	\N	{"path": "/api/tienda/admin/productos/59/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
73	2026-03-31 21:09:37.304461+00	e8123f8d-3733-4dd9-b885-a452fc7b550d	catalogo.Marca	12	create	\N	{"id": 12, "slug": "categoriainventada", "tipo": "accesorio_moto", "activa": true, "nombre": "CATEGORIAINVENTADA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=accesorio_moto"}	2
74	2026-03-31 21:10:51.716674+00	fc0f949c-3a65-47c0-b562-fc5ed81e0a1c	catalogo.SubcategoriaProducto	18	create	\N	{"id": 18, "slug": "categoria-inventada", "activa": true, "nombre": "Categoria Inventada", "categoria": 1, "descripcion": ""}	{"path": "/api/catalogo/accesorios-moto/categorias/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
75	2026-03-31 21:11:41.892603+00	b308c253-d3da-4dd4-9f8a-8c455ab086e4	productos.Producto	60	create	\N	{"id": 60, "slug": "producto-inventado", "marca": 12, "activo": true, "nombre": "Producto Inventado", "precio": "15000.00", "descripcion": "descripcion inventada para un produccto inventado", "es_destacado": true, "subcategoria": 18, "fecha_creacion": "2026-03-31T21:11:41.832941+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020.jpeg", "requiere_compatibilidad": true}	{"path": "/api/tienda/admin/accesorios-motos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
76	2026-03-31 21:36:35.211553+00	bdb89739-02ea-4f59-8ca1-7c408d3c0560	catalogo.Marca	13	create	\N	{"id": 13, "slug": "marca-inventada", "tipo": "accesorio_moto", "activa": true, "nombre": "MARCA INVENTADA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=accesorio_moto"}	2
77	2026-03-31 21:36:40.618309+00	2e3c536b-cdcd-49c0-aae7-04e69a78973a	catalogo.Marca	12	delete	{"id": 12, "slug": "categoriainventada", "tipo": "accesorio_moto", "activa": true, "nombre": "CATEGORIAINVENTADA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/12/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
78	2026-03-31 21:36:44.112452+00	eaec426c-aaf3-4b47-bfbe-457c0ba36a90	catalogo.Marca	13	delete	{"id": 13, "slug": "marca-inventada", "tipo": "accesorio_moto", "activa": true, "nombre": "MARCA INVENTADA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/13/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
79	2026-03-31 21:37:02.013011+00	12ba09e2-1498-4478-8e51-2a6b30b4247c	motos.ModeloMoto	17	create	\N	{"id": 17, "peso": null, "slug": "midm33", "marca": 11, "activo": true, "torque": null, "potencia": null, "categoria": 7, "cilindrada": null, "tipo_motor": "", "descripcion": "", "transmision": "", "nombre_modelo": "MIDM33", "refrigeracion": "", "capacidad_estanque": null}	{"path": "/api/motos/modelos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
80	2026-03-31 21:37:26.762686+00	b32329dd-62bd-429d-9177-0c556bfbfeab	motos.ModeloMoto	17	delete	{"id": 17, "peso": null, "slug": "midm33", "marca": 11, "activo": true, "torque": null, "potencia": null, "categoria": 7, "cilindrada": null, "tipo_motor": "", "descripcion": "", "transmision": "", "nombre_modelo": "MIDM33", "refrigeracion": "", "capacidad_estanque": null}	\N	{"path": "/api/motos/modelos/17/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
81	2026-03-31 21:37:37.203228+00	8b192f8a-e300-466e-a57b-46a12fc8602f	catalogo.SubcategoriaProducto	19	create	\N	{"id": 19, "slug": "caca-aca-ca", "activa": true, "nombre": "Caca Aca Ca", "categoria": 1, "descripcion": ""}	{"path": "/api/catalogo/accesorios-moto/categorias/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
82	2026-03-31 21:37:39.760024+00	03bac318-4624-4541-ae64-203513b680bb	catalogo.SubcategoriaProducto	19	delete	{"id": 19, "slug": "caca-aca-ca", "activa": true, "nombre": "Caca Aca Ca", "categoria": 1, "descripcion": ""}	\N	{"path": "/api/catalogo/accesorios-moto/categorias/19/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
83	2026-03-31 21:37:48.484779+00	e6add139-f4f6-4fd3-995e-5ddb8951daaf	catalogo.Marca	14	create	\N	{"id": 14, "slug": "daca-sc-asda", "tipo": "accesorio_rider", "activa": true, "nombre": "DACA SC ASDA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=accesorio_rider"}	2
88	2026-04-01 00:35:22.817199+00	ba5a564a-f8fe-4c88-a23d-aefe55e3778f	productos.Producto	61	create	\N	{"id": 61, "slug": "rampla-4rs", "marca": 4, "activo": true, "nombre": "Rampla 4RS", "precio": "15000.00", "descripcion": "Descripcion falsa para un producto falso", "es_destacado": false, "subcategoria": 1, "fecha_creacion": "2026-04-01T00:35:22.795818+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_TBWmNUV.jpeg", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/accesorios-motos/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
89	2026-04-01 00:35:28.86819+00	0b79e41a-d30a-45d6-9c56-e7961b98ecb9	productos.Producto	61	delete	{"id": 61, "slug": "rampla-4rs", "marca": 4, "activo": true, "nombre": "Rampla 4RS", "precio": "15000.00", "descripcion": "Descripcion falsa para un producto falso", "es_destacado": false, "subcategoria": 1, "fecha_creacion": "2026-04-01T00:35:22.795818+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_TBWmNUV.jpeg", "requiere_compatibilidad": false}	\N	{"path": "/api/tienda/admin/productos/61/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
90	2026-04-01 00:39:36.235946+00	ebac3895-633c-4b20-bb9f-3f9001347fbe	productos.Producto	4	update	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Commander 2 Reveal Azul Rojo Brillo", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/4/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
91	2026-04-01 00:40:12.43169+00	37c0b1ad-f1d1-4ea2-bda6-48eac71b8f69	productos.Producto	62	create	\N	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto ficticio", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/accesorios-rider/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
92	2026-04-01 00:40:29.931694+00	77b3f399-71dd-4301-85b1-14306ef9d541	productos.Producto	62	update	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto ficticio", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "", "requiere_compatibilidad": false}	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto ficticio", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/62/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
93	2026-04-01 00:40:47.61327+00	525de5d8-9a1a-48d7-86c4-3dcd701f12f6	productos.Producto	62	update	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto ficticio", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/62/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
94	2026-04-01 00:42:36.444738+00	b29e68c8-71a3-4dea-a472-4688607dc995	productos.Producto	62	update	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "15000.00", "descripcion": "descripcion ficticia para un producto", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "150000.00", "descripcion": "descripcion ficticia para un producto", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/62/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
95	2026-04-01 00:43:10.238271+00	19faf281-3afe-4798-bf9f-ea45592f757e	productos.Producto	62	delete	{"id": 62, "slug": "producto-ficticio", "marca": 2, "activo": true, "nombre": "Producto Ficticio", "precio": "150000.00", "descripcion": "descripcion ficticia para un producto", "es_destacado": false, "subcategoria": 15, "fecha_creacion": "2026-04-01T00:40:12.418255+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/M_whatsapp-image-2024-07-22-at-16-12-405020_2dYG690.jpeg", "requiere_compatibilidad": false}	\N	{"path": "/api/tienda/admin/productos/62/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
96	2026-04-01 00:56:29.10382+00	1c5cec03-47ae-4ee9-a40d-ddc097ecde49	productos.Producto	40	delete	{"id": 40, "slug": "bolso-estanque-rhinowalk-5l", "marca": 6, "activo": true, "nombre": "Bolso Estanque RHINOWALK 5L", "precio": "45990.00", "descripcion": "El bolso estanque Rhinowalk de 5 litros es un accesorio compacto y completamente impermeable, ideal para transportar objetos esenciales durante la conducción. Su diseño tipo “dry bag” evita la filtración de agua, protegiendo pertenencias como documentos, herramientas pequeñas o dispositivos electrónicos.\\r\\n\\r\\nSe instala fácilmente sobre el estanque o parte frontal de la motocicleta mediante correas ajustables, ofreciendo acceso rápido y comodidad durante la ruta. Gracias a su tamaño reducido y peso ligero, es perfecto para uso urbano o viajes cortos.", "es_destacado": false, "subcategoria": 2, "fecha_creacion": "2026-03-23T21:00:29.296065+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/22_4H8c4Qr.webp", "requiere_compatibilidad": false}	\N	{"path": "/api/tienda/admin/productos/40/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
97	2026-04-01 01:12:02.905688+00	3242338e-202b-4f4d-93ee-b36ee04b7458	productos.Producto	2	update	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/2/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
98	2026-04-01 01:12:07.803448+00	16a47aa0-adfc-49e3-9ea0-be89f76cc267	productos.Producto	3	update	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 2, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/3/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
99	2026-04-01 01:12:23.698602+00	5dd18d57-5625-4ea3-bec6-1abadf46f070	productos.Producto	3	update	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 2, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/3/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
100	2026-04-01 01:12:26.274262+00	074a6c47-30aa-432b-93c7-ce208cc9c4cb	productos.Producto	2	update	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/2/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
101	2026-04-01 01:25:45.910145+00	4cf366f4-deaf-428f-9304-25961bebbf22	catalogo.SubcategoriaProducto	18	delete	{"id": 18, "slug": "categoria-inventada", "activa": true, "nombre": "Categoria Inventada", "categoria": 1, "descripcion": ""}	\N	{"path": "/api/catalogo/accesorios-moto/categorias/18/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
102	2026-04-01 01:25:51.6644+00	0bacd235-722f-4255-a9d7-58b1e9c19d75	catalogo.Marca	15	delete	{"id": 15, "slug": "mda", "tipo": "accesorio_rider", "activa": true, "nombre": "MDA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/15/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
103	2026-04-01 01:26:13.245042+00	ae4bedd3-827a-4559-ac19-b0780e73ad99	catalogo.Marca	16	create	\N	{"id": 16, "slug": "marca-inventada", "tipo": "accesorio_rider", "activa": true, "nombre": "MARCA INVENTADA", "url_logo": "", "descripcion": ""}	{"path": "/api/motos/marcas/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": "tipo=accesorio_rider"}	2
104	2026-04-01 01:26:31.411112+00	d393a5ad-a522-4770-bfc0-31bee79045d8	productos.Producto	63	create	\N	{"id": 63, "slug": "casco-inventado", "marca": 16, "activo": true, "nombre": "Casco Inventado", "precio": "15000.00", "descripcion": "inventadisimo", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-04-01T01:26:31.401455+00:00", "orden_carrusel": 1, "imagen_principal": "", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/accesorios-rider/", "method": "POST", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
105	2026-04-01 01:26:53.813998+00	0641889e-f058-49aa-9383-8c0b2f42a5f6	catalogo.Marca	16	delete	{"id": 16, "slug": "marca-inventada", "tipo": "accesorio_rider", "activa": true, "nombre": "MARCA INVENTADA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/16/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
106	2026-04-01 21:30:56.578973+00	98bf4cee-200a-429e-a4f4-640afe99e9f9	productos.Producto	5	update	{"id": 5, "slug": "casco-airoh-matryx-rocket-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Rocket Azul/Rojo Brillo", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:09:28.844195+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_azul_brillo_1.webp", "requiere_compatibilidad": false}	{"id": 5, "slug": "casco-airoh-matryx-rocket-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Azul/Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:09:28.844195+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_azul_brillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/5/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
107	2026-04-01 21:31:19.693577+00	e06a0504-6e88-4f7b-a1e6-11afdc545100	productos.Producto	7	update	{"id": 7, "slug": "casco-airoh-matryx-negro-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Negro Mate", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:06.795421+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"id": 7, "slug": "casco-airoh-matryx-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Negro Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:06.795421+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/7/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
108	2026-04-01 21:31:34.036778+00	a79a9010-6b70-4693-9440-1cc8a008d7ea	productos.Producto	12	update	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Scope Amarillo Mate", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Amarillo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/12/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
109	2026-04-01 21:31:39.324657+00	54c4bea4-9813-434d-8b10-c4ab308ab8d7	productos.Producto	21	update	{"id": 21, "slug": "casco-airoh-matryx-rocket-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Rocket Rojo Brillo", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:14.053740+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 21, "slug": "casco-airoh-matryx-rocket-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:14.053740+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/21/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
110	2026-04-01 21:31:48.171495+00	aa255341-1b6f-4564-a6f5-a6fb1dfc56ed	productos.Producto	28	update	{"id": 28, "slug": "casco-airoh-matryx-scope-light-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Scope Light Gris Brillo", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:06.500184+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_grey_1.webp", "requiere_compatibilidad": false}	{"id": 28, "slug": "casco-airoh-matryx-scope-light-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Gris Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:06.500184+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_grey_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/28/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
111	2026-04-01 21:31:53.584949+00	e4abdecd-061c-4dda-868b-98d564f7adf0	productos.Producto	12	update	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Amarillo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Amarillo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/12/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
112	2026-04-01 21:32:00.767207+00	a990400a-9929-4cc1-845c-7e53086effba	productos.Producto	25	update	{"id": 25, "slug": "casco-airoh-matryx-scope-light-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Scope Light Azul/Rojo Brillo", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:40.417691+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 25, "slug": "casco-airoh-matryx-scope-light-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Azul/Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:40.417691+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/25/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
113	2026-04-01 21:32:07.073015+00	389265ae-f3cb-4be3-8171-461e1e386789	productos.Producto	19	update	{"id": 19, "slug": "casco-airoh-matryx-rocket-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Rocket Naranjo Mate", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:16.410710+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Orange_1.webp", "requiere_compatibilidad": false}	{"id": 19, "slug": "casco-airoh-matryx-rocket-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Naranjo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:16.410710+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Orange_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/19/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
114	2026-04-01 21:32:15.131421+00	e96c7a73-dd4f-4edf-ad4e-f0c5bc240fd3	productos.Producto	8	update	{"id": 8, "slug": "casco-airoh-matryx-rocket-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Matryx Rocket Rosado Mate", "precio": "479990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:54.268378+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Connor_Achieve_Rosado_1.webp", "requiere_compatibilidad": false}	{"id": 8, "slug": "casco-airoh-matryx-rocket-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rosado Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:54.268378+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Connor_Achieve_Rosado_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/8/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
115	2026-04-01 21:33:01.947557+00	248543da-49e1-4f89-9a23-f570143284c5	productos.Producto	23	update	{"id": 23, "slug": "casco-para-moto-airoh-bandit-negro-mate", "marca": 2, "activo": true, "nombre": "Casco para moto Airoh Bandit Negro Mate", "precio": "379990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:25:58.903341+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"id": 23, "slug": "casco-para-moto-airoh-bandit-negro-mate", "marca": 2, "activo": true, "nombre": "Casco Para Moto AIROH Bandit Negro Mate", "precio": "349990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:25:58.903341+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/23/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
116	2026-04-01 21:33:08.375475+00	bd0fa426-55ac-45b7-b31c-11ec8657701b	productos.Producto	24	update	{"id": 24, "slug": "casco-para-moto-airoh-bandit-spicy-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco para moto Airoh Bandit Spicy Gris Brillo", "precio": "379990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:08.229631+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Spicy_Gris_1_0490dbb8-c134-4608-9c03-6508a6771689.webp", "requiere_compatibilidad": false}	{"id": 24, "slug": "casco-para-moto-airoh-bandit-spicy-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco Para Moto AIROH Bandit Spicy Gris Brillo", "precio": "349990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:08.229631+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Spicy_Gris_1_0490dbb8-c134-4608-9c03-6508a6771689.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/24/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
117	2026-04-01 21:33:13.047982+00	5c42c9ff-e561-450a-8207-c9a7fe11a213	productos.Producto	31	update	{"id": 31, "slug": "casco-airoh-bandit-tune-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Bandit Tune Azul Rojo Brillo", "precio": "379990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:30:47.974648+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Bandit_Tune_Azul_Rojo_1.webp", "requiere_compatibilidad": false}	{"id": 31, "slug": "casco-airoh-bandit-tune-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Bandit Tune Azul Rojo Brillo", "precio": "349990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:30:47.974648+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Bandit_Tune_Azul_Rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/31/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
118	2026-04-01 21:33:17.499509+00	1aa32bc7-8e62-4616-974a-c4c19b1a6fad	productos.Producto	36	update	{"id": 36, "slug": "casco-airoh-bandit-spicy-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Bandit Spicy Rojo Brillo", "precio": "379990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:33:20.217879+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Spicy_Rojo_1_67dc0664-6f81-4a44-b18a-0c5a941b8664.webp", "requiere_compatibilidad": false}	{"id": 36, "slug": "casco-airoh-bandit-spicy-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Bandit Spicy Rojo Brillo", "precio": "349990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:33:20.217879+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Spicy_Rojo_1_67dc0664-6f81-4a44-b18a-0c5a941b8664.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/36/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
119	2026-04-01 21:33:22.177212+00	163daa22-c20e-497c-8782-a32c455be789	productos.Producto	38	update	{"id": 38, "slug": "casco-airoh-bandit-horn-blanco-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Bandit Horn Blanco brillo", "precio": "379990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:34:21.342954+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Horn_Blanco_1.webp", "requiere_compatibilidad": false}	{"id": 38, "slug": "casco-airoh-bandit-horn-blanco-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Bandit Horn Blanco Brillo", "precio": "349990.00", "descripcion": "El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:34:21.342954+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Bandit_Horn_Blanco_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/38/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
120	2026-04-01 21:36:20.247662+00	e5d52512-e56c-44ec-b5e3-4a23ded1f9ba	productos.Producto	12	update	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Amarillo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"id": 12, "slug": "casco-airoh-matryx-scope-amarillo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Amarillo Mate", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:17:10.647826+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/12/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
121	2026-04-01 21:36:26.072051+00	3aabaf87-bf7a-40dc-aab8-510c3ab74879	productos.Producto	8	update	{"id": 8, "slug": "casco-airoh-matryx-rocket-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rosado Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:54.268378+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Connor_Achieve_Rosado_1.webp", "requiere_compatibilidad": false}	{"id": 8, "slug": "casco-airoh-matryx-rocket-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rosado Mate", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:54.268378+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Connor_Achieve_Rosado_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/8/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
122	2026-04-01 21:36:31.193926+00	e4f7ab52-40f8-4cef-bd59-40b5d413fdc8	productos.Producto	21	update	{"id": 21, "slug": "casco-airoh-matryx-rocket-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:14.053740+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 21, "slug": "casco-airoh-matryx-rocket-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Rojo Brillo", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:14.053740+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/21/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
123	2026-04-01 21:36:39.691491+00	9e85ebdd-5c01-4852-b70f-9c27d2bb60a8	productos.Producto	7	update	{"id": 7, "slug": "casco-airoh-matryx-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Negro Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:06.795421+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"id": 7, "slug": "casco-airoh-matryx-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Negro Mate", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:11:06.795421+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Negro_Mate_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/7/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
124	2026-04-01 21:36:45.930346+00	1f30af68-106d-4926-877a-fd033cc4c311	productos.Producto	28	update	{"id": 28, "slug": "casco-airoh-matryx-scope-light-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Gris Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:06.500184+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_grey_1.webp", "requiere_compatibilidad": false}	{"id": 28, "slug": "casco-airoh-matryx-scope-light-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Gris Brillo", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:06.500184+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_grey_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/28/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
125	2026-04-01 21:36:52.14591+00	30a9e38b-f158-46c6-a581-613e734a50ec	productos.Producto	25	update	{"id": 25, "slug": "casco-airoh-matryx-scope-light-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Azul/Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:40.417691+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 25, "slug": "casco-airoh-matryx-scope-light-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Scope Light Azul/Rojo Brillo", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:27:40.417691+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Scope_light_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/25/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
126	2026-04-01 21:36:57.354526+00	0f4eb0ac-55b9-46f0-bfef-53647eacd62b	productos.Producto	19	update	{"id": 19, "slug": "casco-airoh-matryx-rocket-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Naranjo Mate", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:16.410710+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Orange_1.webp", "requiere_compatibilidad": false}	{"id": 19, "slug": "casco-airoh-matryx-rocket-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Naranjo Mate", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:16.410710+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_Orange_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/19/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
127	2026-04-01 21:37:21.908353+00	1437b900-8a8c-43a2-87c1-7bf3afd75e15	productos.Producto	10	update	{"id": 10, "slug": "casco-airoh-commander-2-carbono-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Commander 2 Carbono Brillo", "precio": "769990.00", "descripcion": "Casco de estilo Trail con calota fabricada en full carbono 6K de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:11.754564+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Commander_carbono_1.webp", "requiere_compatibilidad": false}	{"id": 10, "slug": "casco-airoh-commander-2-carbono-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Carbono Brillo", "precio": "699990.00", "descripcion": "Casco de estilo Trail con calota fabricada en full carbono 6K de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:11.754564+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Commander_carbono_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/10/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
128	2026-04-01 21:37:29.080601+00	89e16692-1238-4cc4-ae45-587d195ee94f	productos.Producto	2	update	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"id": 2, "slug": "casco-airoh-commander-2-reveal-rojo-fluor-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Rojo Fluor Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:02:39.054329+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/2/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
129	2026-04-01 21:37:36.084174+00	063fc0ef-a359-4fa0-836a-2a0c6bdd9f06	productos.Producto	4	update	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/4/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
130	2026-04-01 21:37:42.208065+00	03b060f5-2ea7-4108-8983-98ef3fef5585	productos.Producto	9	update	{"id": 9, "slug": "casco-airoh-commander-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Commander 2 Negro Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:13:30.362328+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Negro_Mate.webp", "requiere_compatibilidad": false}	{"id": 9, "slug": "casco-airoh-commander-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Negro Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:13:30.362328+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Negro_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/9/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
131	2026-04-01 21:37:46.995516+00	5072e2bf-9840-4c50-a215-0402c9749521	productos.Producto	3	update	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/3/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
132	2026-04-01 21:37:52.388113+00	342a788d-7cac-43e7-acf6-b1933d8a9894	productos.Producto	20	update	{"id": 20, "slug": "casco-airoh-commander-2-reveal-azul-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Commander 2 Reveal Azul Brillo", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:46.601048+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo.webp", "requiere_compatibilidad": false}	{"id": 20, "slug": "casco-airoh-commander-2-reveal-azul-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:23:46.601048+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/20/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
133	2026-04-01 21:37:58.168381+00	bbea27c8-9d3f-404b-95d9-19a9efe31157	productos.Producto	22	update	{"id": 22, "slug": "casco-airoh-commander-2-mavick-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Commander 2 Mavick Naranjo Mate", "precio": "593990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:48.039587+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Mavick_Naranjo_Mate.webp", "requiere_compatibilidad": false}	{"id": 22, "slug": "casco-airoh-commander-2-mavick-naranjo-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Mavick Naranjo Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:24:48.039587+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Mavick_Naranjo_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/22/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
134	2026-04-01 21:38:29.374651+00	b3325ef1-1b2b-4f7c-be0d-ae4f92416ee5	productos.Producto	5	update	{"id": 5, "slug": "casco-airoh-matryx-rocket-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Azul/Rojo Brillo", "precio": "429990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:09:28.844195+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_azul_brillo_1.webp", "requiere_compatibilidad": false}	{"id": 5, "slug": "casco-airoh-matryx-rocket-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Matryx Rocket Azul/Rojo Brillo", "precio": "340990.00", "descripcion": "Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:09:28.844195+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Matryx_Rocket_rojo_azul_brillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/5/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
135	2026-04-01 21:39:11.904312+00	8d7aec40-dd1d-467c-b765-bf96a8fcf3b5	productos.Producto	6	update	{"id": 6, "slug": "casco-de-moto-airoh-specktre-blanco-brillo", "marca": 2, "activo": true, "nombre": "Casco de Moto Airoh Specktre Blanco Brillo", "precio": "359990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:10:24.698881+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_blanco_1.webp", "requiere_compatibilidad": false}	{"id": 6, "slug": "casco-de-moto-airoh-specktre-blanco-brillo", "marca": 2, "activo": true, "nombre": "Casco De Moto AIROH Specktre Blanco Brillo", "precio": "319990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:10:24.698881+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_blanco_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/6/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
136	2026-04-01 21:39:16.573725+00	ee607526-70ef-4fe9-ad71-48f1d27e8f48	productos.Producto	32	update	{"id": 32, "slug": "casco-de-moto-airoh-specktre-negro-mate", "marca": 2, "activo": true, "nombre": "Casco de Moto Airoh Specktre Negro Mate", "precio": "359990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready,", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:31:23.469758+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_negro_1.webp", "requiere_compatibilidad": false}	{"id": 32, "slug": "casco-de-moto-airoh-specktre-negro-mate", "marca": 2, "activo": true, "nombre": "Casco De Moto AIROH Specktre Negro Mate", "precio": "319990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready,", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:31:23.469758+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_negro_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/32/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
137	2026-04-01 21:39:21.321673+00	47dcdc40-faa0-40ee-a5e0-bd172c892164	productos.Producto	35	update	{"id": 35, "slug": "casco-de-moto-airoh-specktre-cement-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco de Moto Airoh Specktre Cement Gris Brillo", "precio": "359990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:32:42.944653+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_cement_grey_1.webp", "requiere_compatibilidad": false}	{"id": 35, "slug": "casco-de-moto-airoh-specktre-cement-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco De Moto AIROH Specktre Cement Gris Brillo", "precio": "319990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:32:42.944653+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_cement_grey_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/35/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
138	2026-04-01 21:39:26.195988+00	ebc064b2-0c65-40a1-a699-2a1b2eb1ca95	productos.Producto	37	update	{"id": 37, "slug": "casco-de-moto-airoh-specktre-groove-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco de Moto Airoh Specktre Groove Gris Brillo", "precio": "359990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:33:48.594116+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_Groove_gris_brillo.webp", "requiere_compatibilidad": false}	{"id": 37, "slug": "casco-de-moto-airoh-specktre-groove-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco De Moto AIROH Specktre Groove Gris Brillo", "precio": "319990.00", "descripcion": "Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:33:48.594116+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Specktre_Groove_gris_brillo.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/37/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
153	2026-04-02 03:05:26.951689+00	d4d916d8-66d8-4769-92ce-6f8e68c7e382	productos.Producto	4	update	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/4/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
139	2026-04-01 21:40:15.971446+00	2f72805c-7c29-4dbe-8cc5-34fc1d29da1a	productos.Producto	11	update	{"id": 11, "slug": "casco-airoh-spark-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Negro Mate", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:51.348918+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Negro_mate_2.webp", "requiere_compatibilidad": false}	{"id": 11, "slug": "casco-airoh-spark-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Negro Mate", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:51.348918+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Negro_mate_2.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/11/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
140	2026-04-01 21:40:21.336089+00	3cb1f4ea-0639-4886-8347-4ce6f79a3c5e	productos.Producto	13	update	{"id": 13, "slug": "casco-airoh-spark-2-zenith-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Zenith Rosado Mate", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:18:06.392748+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_zenith_Rosado_mate_1.webp", "requiere_compatibilidad": false}	{"id": 13, "slug": "casco-airoh-spark-2-zenith-rosado-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Zenith Rosado Mate", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:18:06.392748+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_zenith_Rosado_mate_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/13/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
141	2026-04-01 21:40:26.410318+00	03e06211-a7f3-4756-b86f-5be504727598	productos.Producto	15	update	{"id": 15, "slug": "casco-airoh-spark-2-dart-azul-rojo", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Dart Azul/Rojo", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:19:11.814662+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 15, "slug": "casco-airoh-spark-2-dart-azul-rojo", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Dart Azul/Rojo", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:19:11.814662+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_azul_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/15/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
142	2026-04-01 21:40:30.469254+00	11be51e8-d57d-4fc4-ac06-b1169fd47150	productos.Producto	26	update	{"id": 26, "slug": "casco-airoh-spark-2-cement-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Cement Gris Brillo", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:28:04.914738+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Cement_1.webp", "requiere_compatibilidad": false}	{"id": 26, "slug": "casco-airoh-spark-2-cement-gris-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Cement Gris Brillo", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:28:04.914738+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Cement_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/26/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
143	2026-04-01 21:40:34.67308+00	2f2e45a2-dc0f-4e63-b3c0-497542e9e3c0	productos.Producto	29	update	{"id": 29, "slug": "casco-airoh-spark-2-dart-amarillo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Dart Amarillo Brillo", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:31.050370+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_Amarillo_1.webp", "requiere_compatibilidad": false}	{"id": 29, "slug": "casco-airoh-spark-2-dart-amarillo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Dart Amarillo Brillo", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:29:31.050370+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_Amarillo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/29/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
144	2026-04-01 21:40:38.648597+00	866a6789-77da-4ca3-9d90-6f2f5bfbb1a7	productos.Producto	30	update	{"id": 30, "slug": "casco-airoh-spark-2-dart-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Dart Rojo Brillo", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:30:07.919499+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_rojo_1.webp", "requiere_compatibilidad": false}	{"id": 30, "slug": "casco-airoh-spark-2-dart-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Dart Rojo Brillo", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:30:07.919499+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_rojo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/30/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
145	2026-04-01 21:40:42.340655+00	fa7aaa6d-aac8-4f02-be27-2800a6bc7225	productos.Producto	34	update	{"id": 34, "slug": "casco-airoh-spark-2-chrono-naranjo-brillo", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Chrono Naranjo Brillo", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:32:17.875932+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Chrono_naranjo_1.webp", "requiere_compatibilidad": false}	{"id": 34, "slug": "casco-airoh-spark-2-chrono-naranjo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Chrono Naranjo Brillo", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:32:17.875932+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Chrono_naranjo_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/34/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
146	2026-04-01 21:40:46.957038+00	b36a2cbf-cf83-49ac-be4b-de2b402be292	productos.Producto	39	update	{"id": 39, "slug": "casco-airoh-spark-2-dart-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco Airoh Spark 2 Dart Militar Verde Mate", "precio": "299990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:34:52.605939+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_verde_militar_1.webp", "requiere_compatibilidad": false}	{"id": 39, "slug": "casco-airoh-spark-2-dart-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Dart Militar Verde Mate", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:34:52.605939+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Dart_verde_militar_1.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/39/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
147	2026-04-01 21:40:51.099001+00	97c80a6d-611b-4675-8d23-1ac71d374d29	productos.Producto	11	update	{"id": 11, "slug": "casco-airoh-spark-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Negro Mate", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:51.348918+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Negro_mate_2.webp", "requiere_compatibilidad": false}	{"id": 11, "slug": "casco-airoh-spark-2-negro-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Spark 2 Negro Mate", "precio": "269990.00", "descripcion": "Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T02:14:51.348918+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Airoh_Spark_2_Negro_mate_2.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/11/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	3
148	2026-04-01 21:43:06.361987+00	4b32b040-cb50-4d81-809d-958999e02d95	motos.ModeloMoto	16	delete	{"id": 16, "peso": null, "slug": "cbr650r", "marca": 11, "activo": true, "torque": null, "potencia": null, "categoria": 7, "cilindrada": null, "tipo_motor": "", "descripcion": "", "transmision": "", "nombre_modelo": "CBR650R", "refrigeracion": "", "capacidad_estanque": null}	\N	{"path": "/api/motos/modelos/16/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
149	2026-04-01 21:43:09.5309+00	b447ce48-76e9-4a67-a6c1-fb7189610b24	catalogo.Marca	11	delete	{"id": 11, "slug": "honda", "tipo": "moto", "activa": true, "nombre": "HONDA", "url_logo": "", "descripcion": ""}	\N	{"path": "/api/motos/marcas/11/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
150	2026-04-01 21:43:13.837204+00	7c5004d6-b2c8-4244-b1e9-683887f1bb21	catalogo.CategoriaMoto	7	delete	{"id": 7, "slug": "super-sport", "activa": true, "nombre": "Super Sport", "descripcion": ""}	\N	{"path": "/api/motos/categorias/7/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
151	2026-04-01 21:43:27.357128+00	3f36560f-e5d7-4a1f-8a6a-490270b5fc5c	catalogo.SubcategoriaProducto	20	delete	{"id": 20, "slug": "mda-categoria", "activa": true, "nombre": "Mda Categoria", "categoria": 2, "descripcion": ""}	\N	{"path": "/api/catalogo/accesorios-rider/categorias/20/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
152	2026-04-01 21:43:34.464806+00	b0754982-6ed5-4699-b824-4d3965a651fd	catalogo.SubcategoriaProducto	17	delete	{"id": 17, "slug": "categoria-prueba-2", "activa": true, "nombre": "Categoria Prueba 2", "categoria": 2, "descripcion": ""}	\N	{"path": "/api/catalogo/accesorios-rider/categorias/17/", "method": "DELETE", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
154	2026-04-02 03:05:30.610443+00	fe014d16-8bd9-4a2e-a4ad-0f2043a59e69	productos.Producto	4	update	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"id": 4, "slug": "casco-airoh-commander-2-reveal-azul-rojo-brillo", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Azul Rojo Brillo", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:04:35.757915+00:00", "orden_carrusel": 1, "imagen_principal": "productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/4/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
155	2026-04-02 03:10:39.85148+00	69cdb758-970d-4ce2-9e59-27139236ec90	productos.Producto	3	update	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/3/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
156	2026-04-02 03:10:43.141786+00	24372e1a-dad5-4021-956b-de59289ba33e	productos.Producto	3	update	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": true, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"id": 3, "slug": "casco-airoh-commander-2-reveal-militar-verde-mate", "marca": 2, "activo": true, "nombre": "Casco AIROH Commander 2 Reveal Militar Verde Mate", "precio": "539990.00", "descripcion": "Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.", "es_destacado": false, "subcategoria": 16, "fecha_creacion": "2026-03-17T00:03:58.134604+00:00", "orden_carrusel": 1, "imagen_principal": "productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp", "requiere_compatibilidad": false}	{"path": "/api/tienda/admin/productos/3/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
157	2026-04-02 03:10:49.487824+00	e77c4981-71db-4218-8b6c-20fceb6164ee	motos.Moto	11	update	{"id": 11, "anio": 2026, "slug": "ds900x", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "DS900X", "precio": "9990000.00", "descripcion": "La Voge DS 900X está equipada con un potente motor bicilíndrico en línea de 895 cc. Cuenta con culatas DOHC de ocho válvulas, eje de equilibrado y embrague antirrebote. Este propulsor entrega una potencia máxima de 96,5 HP a 8250 rpm y un par motor de 95 Nm a 6250 rpm. Incluye además cambio rápido QSS tanto de subida como bajada, mejorando notablemente la experiencia de conducción.", "modelo_moto": 11, "es_destacada": true, "precio_lista": "9990000.00", "fecha_creacion": "2026-03-16T00:15:40.396722+00:00", "orden_carrusel": 2, "imagen_principal": "motos/ds900x.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 11, "anio": 2026, "slug": "ds900x", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "DS900X", "precio": "9990000.00", "descripcion": "La Voge DS 900X está equipada con un potente motor bicilíndrico en línea de 895 cc. Cuenta con culatas DOHC de ocho válvulas, eje de equilibrado y embrague antirrebote. Este propulsor entrega una potencia máxima de 96,5 HP a 8250 rpm y un par motor de 95 Nm a 6250 rpm. Incluye además cambio rápido QSS tanto de subida como bajada, mejorando notablemente la experiencia de conducción.", "modelo_moto": 11, "es_destacada": false, "precio_lista": "9990000.00", "fecha_creacion": "2026-03-16T00:15:40.396722+00:00", "orden_carrusel": 2, "imagen_principal": "motos/ds900x.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/11/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
158	2026-04-02 03:11:45.238602+00	c64e760a-6b34-4b92-bba6-8bcbc3f47c9d	motos.Moto	11	update	{"id": 11, "anio": 2026, "slug": "ds900x", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "DS900X", "precio": "9990000.00", "descripcion": "La Voge DS 900X está equipada con un potente motor bicilíndrico en línea de 895 cc. Cuenta con culatas DOHC de ocho válvulas, eje de equilibrado y embrague antirrebote. Este propulsor entrega una potencia máxima de 96,5 HP a 8250 rpm y un par motor de 95 Nm a 6250 rpm. Incluye además cambio rápido QSS tanto de subida como bajada, mejorando notablemente la experiencia de conducción.", "modelo_moto": 11, "es_destacada": false, "precio_lista": "9990000.00", "fecha_creacion": "2026-03-16T00:15:40.396722+00:00", "orden_carrusel": 2, "imagen_principal": "motos/ds900x.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"id": 11, "anio": 2026, "slug": "ds900x", "color": "", "marca": 1, "activa": true, "estado": "disponible", "modelo": "DS900X", "precio": "9990000.00", "descripcion": "La Voge DS 900X está equipada con un potente motor bicilíndrico en línea de 895 cc. Cuenta con culatas DOHC de ocho válvulas, eje de equilibrado y embrague antirrebote. Este propulsor entrega una potencia máxima de 96,5 HP a 8250 rpm y un par motor de 95 Nm a 6250 rpm. Incluye además cambio rápido QSS tanto de subida como bajada, mejorando notablemente la experiencia de conducción.", "modelo_moto": 11, "es_destacada": true, "precio_lista": "9990000.00", "fecha_creacion": "2026-03-16T00:15:40.396722+00:00", "orden_carrusel": 2, "imagen_principal": "motos/ds900x.webp", "imagen_con_maletas": "", "precio_con_maletas": null, "video_presentacion": "", "permite_variante_maletas": false, "precio_lista_con_maletas": null}	{"path": "/api/motos/11/", "method": "PATCH", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0", "remote_addr": "127.0.0.1", "query_string": ""}	2
\.


--
-- Data for Name: core_contactositio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.core_contactositio (id, instagram, telefono, ubicacion, actualizado_en) FROM stdin;
1	@delanoe_motos	+56 9 8761 5315	Galvarino 478, Los Angeles, Chile	2026-03-27 23:46:42.209435+00
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	group
3	auth	permission
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	catalogo	categoriamoto
8	catalogo	categoriaproducto
9	catalogo	marca
10	catalogo	subcategoriaproducto
11	motos	especificacionmoto
12	motos	imagenmoto
13	motos	moto
14	productos	compatibilidadproductomoto
15	productos	especificacionproducto
16	productos	imagenproducto
17	productos	producto
18	core	contactositio
19	clientes	contactocliente
20	authtoken	token
21	authtoken	tokenproxy
22	token_blacklist	blacklistedtoken
23	token_blacklist	outstandingtoken
24	clientes	perfilusuario
25	mantenciones	mantencion
26	mantenciones	vehiculocliente
27	motos	modelomoto
28	mantenciones	horariomantencion
29	mantenciones	mantencionestadohistorial
30	analitica	catalogoevento
31	motos	itemfichatecnica
32	motos	seccionfichatecnica
33	motos	tipoatributo
34	motos	valoratributomoto
35	mantenciones	mantenciondiabloqueado
36	mantenciones	mantencionhorabloqueada
37	mantenciones	mantencionhorariofecha
38	core	auditlog
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-03-15 14:23:10.080749+00
2	auth	0001_initial	2026-03-15 14:23:10.182595+00
3	admin	0001_initial	2026-03-15 14:23:10.209028+00
4	admin	0002_logentry_remove_auto_add	2026-03-15 14:23:10.219169+00
5	admin	0003_logentry_add_action_flag_choices	2026-03-15 14:23:10.226821+00
6	contenttypes	0002_remove_content_type_name	2026-03-15 14:23:10.257547+00
7	auth	0002_alter_permission_name_max_length	2026-03-15 14:23:10.266279+00
8	auth	0003_alter_user_email_max_length	2026-03-15 14:23:10.275438+00
9	auth	0004_alter_user_username_opts	2026-03-15 14:23:10.282831+00
10	auth	0005_alter_user_last_login_null	2026-03-15 14:23:10.290903+00
11	auth	0006_require_contenttypes_0002	2026-03-15 14:23:10.292746+00
12	auth	0007_alter_validators_add_error_messages	2026-03-15 14:23:10.299565+00
13	auth	0008_alter_user_username_max_length	2026-03-15 14:23:10.313549+00
14	auth	0009_alter_user_last_name_max_length	2026-03-15 14:23:10.322985+00
15	auth	0010_alter_group_name_max_length	2026-03-15 14:23:10.331641+00
16	auth	0011_update_proxy_permissions	2026-03-15 14:23:10.33927+00
17	auth	0012_alter_user_first_name_max_length	2026-03-15 14:23:10.347755+00
18	authtoken	0001_initial	2026-03-15 14:23:10.367093+00
19	authtoken	0002_auto_20160226_1747	2026-03-15 14:23:10.393027+00
20	authtoken	0003_tokenproxy	2026-03-15 14:23:10.395409+00
21	authtoken	0004_alter_tokenproxy_options	2026-03-15 14:23:10.400317+00
22	catalogo	0001_initial	2026-03-15 14:23:10.453307+00
23	motos	0001_initial	2026-03-15 14:23:10.513433+00
24	productos	0001_initial	2026-03-15 14:23:10.59966+00
25	clientes	0001_initial	2026-03-15 14:23:10.629069+00
26	core	0001_initial	2026-03-15 14:23:10.636+00
27	sessions	0001_initial	2026-03-15 14:23:10.652543+00
28	motos	0002_rename_moto_nombre_modelo	2026-03-15 14:43:08.017544+00
29	catalogo	0002_marca_tipo	2026-03-15 23:53:35.833089+00
30	catalogo	0003_backfill_marca_tipo	2026-03-15 23:55:07.162329+00
31	token_blacklist	0001_initial	2026-03-16 00:27:53.653082+00
32	token_blacklist	0002_outstandingtoken_jti_hex	2026-03-16 00:27:53.664367+00
33	token_blacklist	0003_auto_20171017_2007	2026-03-16 00:27:53.691515+00
34	token_blacklist	0004_auto_20171017_2013	2026-03-16 00:27:53.709345+00
35	token_blacklist	0005_remove_outstandingtoken_jti	2026-03-16 00:27:53.747786+00
36	token_blacklist	0006_auto_20171017_2113	2026-03-16 00:27:53.763419+00
37	token_blacklist	0007_auto_20171017_2214	2026-03-16 00:27:53.844941+00
38	token_blacklist	0008_migrate_to_bigautofield	2026-03-16 00:27:53.905866+00
39	token_blacklist	0010_fix_migrate_to_bigautofield	2026-03-16 00:27:53.930903+00
40	token_blacklist	0011_linearizes_history	2026-03-16 00:27:53.933889+00
41	token_blacklist	0012_alter_outstandingtoken_user	2026-03-16 00:27:53.944932+00
42	token_blacklist	0013_alter_blacklistedtoken_options_and_more	2026-03-16 00:27:53.959501+00
43	clientes	0002_perfilusuario	2026-03-16 11:55:18.80495+00
44	mantenciones	0001_initial	2026-03-18 00:44:07.351146+00
45	motos	0003_modelomoto_and_moto_modelo_ref	2026-03-18 18:23:53.968834+00
46	mantenciones	0002_horariomantencion_mantencion_hora_ingreso_and_more	2026-03-18 21:27:19.930431+00
47	clientes	0003_split_nombre_completo_contactocliente	2026-03-19 01:20:56.491186+00
48	motos	0004_refactor_modelo_tecnico_moto_unidad	2026-03-19 01:57:31.189315+00
49	mantenciones	0003_alter_mantencion_estado	2026-03-19 14:49:12.424577+00
50	analitica	0001_initial	2026-03-19 22:37:11.634375+00
51	mantenciones	0004_mantencionestadohistorial_alter_mantencion_estado_and_more	2026-03-19 22:37:11.805557+00
52	mantenciones	0005_mantencion_rut_cliente	2026-03-23 00:01:05.596775+00
53	clientes	0004_alter_perfilusuario_rol	2026-03-24 12:12:53.1957+00
54	motos	0005_seccionfichatecnica_itemfichatecnica_and_more	2026-03-24 21:46:03.958474+00
55	motos	0006_tipoatributo_valoratributomoto	2026-03-24 21:46:04.039271+00
56	motos	0007_alter_tipoatributo_options_and_more	2026-03-24 21:46:04.105302+00
57	motos	0008_remove_tipoatributo_uq_tipoatributo_nombre	2026-03-24 21:46:04.111709+00
58	motos	0009_moto_orden_carrusel	2026-03-24 22:10:57.303318+00
59	productos	0002_producto_orden_carrusel	2026-03-24 22:10:57.316586+00
60	motos	0010_moto_variante_maletas	2026-03-24 23:16:08.527016+00
61	motos	0011_moto_precio_lista_and_more	2026-03-24 23:51:31.510633+00
62	motos	0012_seed_ficha_tecnica_defaults	2026-03-25 00:22:18.44354+00
63	motos	0013_alter_valoratributomoto_valor_optional	2026-03-25 21:02:28.397101+00
64	motos	0014_moto_video_presentacion	2026-03-26 01:18:43.784091+00
65	motos	0015_alter_moto_video_presentacion	2026-03-26 01:28:12.843464+00
66	motos	0016_alter_moto_video_presentacion_url	2026-03-26 01:49:24.275875+00
67	motos	0017_valoratributomoto_tipo_control	2026-03-27 01:29:29.59194+00
68	mantenciones	0006_rename_estados_operativos	2026-03-27 18:49:29.376629+00
69	mantenciones	0007_harden_integrity_and_security_constraints	2026-03-27 20:08:42.5002+00
70	mantenciones	0008_mantenciondiabloqueado_and_reagendacion	2026-03-27 23:03:59.408624+00
71	mantenciones	0009_mantencionhorariofecha	2026-03-27 23:43:07.618351+00
72	mantenciones	0010_mantencionhorabloqueada	2026-03-27 23:43:07.651535+00
73	catalogo	0004_harden_integrity_catalog	2026-03-28 01:25:32.384415+00
74	catalogo	0005_catalogo_indexes_and_tipo_hardening	2026-03-28 01:25:32.439773+00
75	clientes	0005_harden_integrity_clients	2026-03-28 01:25:32.557998+00
76	core	0002_auditlog	2026-03-28 01:25:32.678742+00
77	motos	0018_harden_integrity_motos	2026-03-28 01:25:33.066314+00
78	motos	0019_moto_denorm_and_performance_indexes	2026-03-28 01:25:33.126208+00
79	productos	0003_harden_integrity_productos	2026-03-28 01:25:33.410426+00
80	mantenciones	0011_mantencion_reminder_sent_at	2026-03-28 01:52:39.090489+00
81	motos	0020_remove_stock_from_moto	2026-03-30 02:33:42.515446+00
82	productos	0004_remove_stock_from_producto	2026-03-30 02:33:42.53463+00
83	motos	0021_remove_moto_chk_moto_stock_gte_0	2026-03-30 11:52:05.372002+00
84	motos	0022_remove_moto_chk_moto_stock_gte_0	2026-03-30 11:53:47.096645+00
85	productos	0005_remove_producto_chk_producto_stock_gte_0	2026-03-30 11:55:06.365748+00
86	mantenciones	0012_vehiculocliente_contacto_snapshot	2026-03-31 02:24:28.769649+00
87	analitica	0002_protect_usuario_fk	2026-04-01 01:52:54.327609+00
88	clientes	0006_protect_foreign_keys	2026-04-01 01:52:54.383313+00
89	core	0003_protect_actor_fk	2026-04-01 01:52:54.40057+00
90	mantenciones	0013_protect_changed_by_fk	2026-04-01 01:52:54.416532+00
91	motos	0022_protect_foreign_keys	2026-04-01 01:52:54.4867+00
92	motos	0023_merge_20260331_2252	2026-04-01 01:52:54.489381+00
93	productos	0005_protect_foreign_keys	2026-04-01 01:52:54.559904+00
94	productos	0006_merge_20260331_2252	2026-04-01 01:52:54.562523+00
120	mantenciones	0014_mantencion_motivo_cancelacion	2026-04-01 18:43:22.684139+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: mantenciones_horariomantencion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_horariomantencion (id, dia_semana, hora_inicio, hora_fin, intervalo_minutos, cupos_por_bloque, activo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mantenciones_mantencion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_mantencion (id, fecha_ingreso, kilometraje_ingreso, tipo_mantencion, motivo, diagnostico, trabajo_realizado, costo_total, estado, fecha_entrega, observaciones, created_at, updated_at, moto_cliente_id, hora_ingreso, rut_cliente, reminder_sent_at, motivo_cancelacion) FROM stdin;
\.


--
-- Data for Name: mantenciones_mantenciondiabloqueado; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_mantenciondiabloqueado (id, fecha, bloqueado, motivo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mantenciones_mantencionestadohistorial; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_mantencionestadohistorial (id, estado_anterior, estado_nuevo, fuente, observacion, changed_at, changed_by_id, mantencion_id) FROM stdin;
\.


--
-- Data for Name: mantenciones_mantencionhorabloqueada; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_mantencionhorabloqueada (id, fecha, hora, bloqueado, motivo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mantenciones_mantencionhorariofecha; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_mantencionhorariofecha (id, fecha, hora_inicio, hora_fin, intervalo_minutos, cupos_por_bloque, activo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mantenciones_vehiculocliente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantenciones_vehiculocliente (id, matricula, marca, modelo, anio, kilometraje_actual, created_at, updated_at, cliente_id, cliente_apellidos, cliente_email, cliente_nombres, cliente_telefono) FROM stdin;
\.


--
-- Data for Name: motos_especificacionmoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_especificacionmoto (id, clave, valor, moto_id) FROM stdin;
\.


--
-- Data for Name: motos_imagenmoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_imagenmoto (id, imagen, texto_alternativo, orden, moto_id) FROM stdin;
2	motos/galeria/2560.webp		1	17
\.


--
-- Data for Name: motos_itemfichatecnica; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_itemfichatecnica (id, nombre, valor, orden, seccion_id) FROM stdin;
\.


--
-- Data for Name: motos_modelomoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_modelomoto (id, nombre_modelo, slug, descripcion, activo, marca_id, capacidad_estanque, categoria_id, cilindrada, peso, potencia, refrigeracion, tipo_motor, torque, transmision) FROM stdin;
1	250RR	250rr		t	1	\N	2	248	\N	\N			\N	
6	300 RALLY	300-rally		t	1	\N	3	292	\N	\N			\N	
7	300DS	300ds		t	1	\N	4	292	\N	\N			\N	
8	300DS SE	300ds-se		t	1	\N	4	292	\N	\N			\N	
9	DS625X	ds625x		t	1	\N	4	581	\N	\N			\N	
10	DS800X-RALLY	ds800x-rally		t	1	\N	4	798	\N	\N			\N	
11	DS900X	ds900x		t	1	\N	4	895	\N	\N			\N	
12	SR150GT	sr150gt		t	1	\N	5	150	\N	\N			\N	
13	SR3	sr3		t	1	\N	5	244	\N	\N			\N	
14	CU250	cu250		t	1	\N	6	250	\N	\N			\N	
3	AC350	ac350		t	1	\N	1	322	\N	\N			\N	
5	R625	r625		t	1	\N	1	581	\N	\N			\N	
2	RR660S	rr660s		t	1	\N	2	663	\N	\N			\N	
4	AC525	ac525		t	1	\N	1	494	\N	\N			\N	
\.


--
-- Data for Name: motos_moto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_moto (id, modelo, slug, descripcion, precio, anio, imagen_principal, es_destacada, activa, fecha_creacion, marca_id, color, estado, modelo_moto_id, orden_carrusel, imagen_con_maletas, permite_variante_maletas, precio_con_maletas, precio_lista, precio_lista_con_maletas, video_presentacion) FROM stdin;
6	300 RALLY	300-rally	Revive la esencia del trail con la Voge 300 Rally, una motocicleta que te invita a desafiar cualquier camino. Su potente motor de 292,4 cc y su diseño ligero te brindan la agilidad que necesitas tanto en el asfalto como en sendero off-road. Las suspensiones de largo recorrido y las llantas todoterreno de 21" y 18" te permitirán superar cualquier obstáculo con total confianza. Equipada con ABS desconectable, esta moto se adapta a tu estilo de manejo, ofreciéndote seguridad y control en cada aventura. Siente la libertad de explorar sin límites y redescubre la pasión por las dos ruedas.	3650000.00	2026	motos/300rally.webp	t	t	2026-03-16 00:08:15.979114+00	1		disponible	6	6	\N	f	\N	3650000.00	\N	
7	300DS	300ds	No te conformes con un solo camino, conquístalos todos. La Voge 300DS es la moto trail aventura que combina versatilidad para tu día a día en la ciudad y la robustez para escapadas de largo recorrido. Su motor de 292 cc te ofrece una potencia de 21 kW, ideal para sentir la libertad en cada trayecto. Con un diseño multipropósito, horquilla invertida y frenos ABS, esta moto está lista para brindarte comodidad y seguridad, sin importar el destino.	3590000.00	2026	motos/300ds.webp	t	t	2026-03-16 00:10:08.182696+00	1		disponible	7	5	\N	f	\N	3590000.00	\N	
12	SR150GT	sr150gt	La Voge SR150GT redefine lo que un scooter puede ofrecer. Con su motor de 10,5 kW, el más potente de su categoría, combina elegancia y rendimiento para acompañarte en cada trayecto. Incorpora tecnologías de última generación como ABS de doble canal, sistema Stop-Start, inyección electrónica y control de tracción, junto a comodidades como acceso sin llave (keyless), amplio espacio de carga y cargadores USB y 12V. Ideal para quienes buscan moverse con seguridad y total practicidad en la ciudad.	2990000.00	2026	motos/sr150gt.webp	f	t	2026-03-16 00:18:06.310535+00	1		disponible	12	1	\N	f	\N	2990000.00	\N	
13	SR3	sr3	Prepárate para una experiencia de conducción inigualable con la Voge SR3. Con un motor monocilíndrico de 25,5 HP y 23 Nm de par máximo, disfrutarás de una respuesta enérgica y un manejo ágil gracias a su contenido peso de 165 kg. Su diseño dinámico y confort superior te invitan a explorar cada rincón, mientras que su equipamiento moderno, incluyendo iluminación LED y un panel LCD, elevan tu experiencia de conducción.	4390000.00	2026	motos/sr3.webp	f	t	2026-03-16 00:18:58.559995+00	1		disponible	13	1	\N	f	\N	4390000.00	\N	
3	AC350	ac350	La agilidad urbana y el diseño Neo-Retro se fusionan en la nueva Voge AC350. Siente la potencia de su nuevo motor bicilíndrico, diseñado para regalarte una sonrisa en cada aceleración. Su increíble ligereza y componentes de primer nivel te ofrecen un manejo divertido y preciso, ideal para conquistar la ciudad con carácter. Una moto que no solo te lleva, sino que te inspira a vivir cada viaje al máximo.	4590000.00	2026	motos/ac350.webp	f	t	2026-03-16 00:03:02.475206+00	1		disponible	3	1	\N	f	\N	4590000.00	\N	
15	250RR	250rr	Experimenta la adrenalina sobre la Voge 250RR, la sportbike que redefine la emoción en cada curva. Con su potente motor de 21,5 kW y embrague antirretroceso, domina la carretera con un manejo ágil y un estilo agresivo. Su diseño full carenado, iluminación LED y tablero digital te brindan tecnología y presencia, invitándote a vivir tu pasión por las dos ruedas al máximo.	3690000.00	2025	motos/250rr.webp	f	t	2026-03-18 20:22:28.382417+00	1		disponible	1	1	\N	f	\N	3690000.00	\N	
8	300DS SE	300ds-se	Más equipada, más cómoda, más inteligente. La 300DS SE eleva el ADN trail de Voge combinando su motor de 292 cc, sus suspensiones de largo recorrido y sus tradicionales frenos ABS con nuevos componentes: panel digital renovado, manillas y asientos calefactables, cubre puños y mandos rediseñados para ofrecer mayor confort y control en cualquier ruta.	4590000.00	2026	motos/300ds-se.webp	f	t	2026-03-16 00:11:19.175069+00	1		disponible	8	1	\N	f	\N	4590000.00	\N	
10	DS800X-RALLY	ds800x-rally	Atrévete a explorar sin límites con la Voge DS800X Rally, una trail de espíritu aventurero diseñada para dominar cualquier terreno. Su motor bicilíndrico ofrece potencia y versatilidad, mientras que las suspensiones ajustables y frenos de alta calidad aseguran un control confiable. Con neumáticos Pirelli, pantalla TFT y gran autonomía, esta moto está lista para acompañarte en cada aventura, sin que nada te detenga.	8990000.00	2026	motos/ds800x-rally.webp	t	t	2026-03-16 00:14:25.147628+00	1		disponible	10	3	motos/800rallyconmaleta.webp	t	9990000.00	9590000.00	10690000.00	https://cdn.rsltda.cl/voge/modelos/2026/ds800xrally/800_rally_horizontal.mp4
5	R625	r625	La Voge R625 es la compañera ideal para quienes buscan libertad y estilo en cada trayecto urbano. Su motor bicilíndrico ofrece una potencia suave y dinámica, mientras que su diseño ágil y moderno te permite dominar la ciudad con total confianza. Equipada con suspensiones KYB, frenos con ABS y control de tracción, este modelo garantiza seguridad y control para que disfrutes cada viaje al máximo, sin límites ni compromisos.	6590000.00	2026	motos/r625.webp	f	t	2026-03-16 00:07:08.452836+00	1		disponible	5	1		f	\N	6590000.00	\N	https://cdn.rsltda.cl/voge/modelos/2026/r625/naked_2_horizontal.mp4
14	CU250	cu250	Descubre la Voge CU250, la cruiser que redefine la libertad. Con un potente motor bicilíndrico V-Twin de 249,9 cc, 26,8 HP y 6 velocidades, te ofrece una experiencia de conducción vibrante y un sonido inconfundible. Su diseño clásico y detalles modernos invitan a destacar, mientras que su equipamiento avanzado garantiza comodidad y seguridad en cada ruta.	3990000.00	2026	motos/cu250.webp	f	t	2026-03-16 00:20:20.742576+00	1		disponible	14	1		f	\N	3990000.00	\N	https://cdn.rsltda.cl/voge/modelos/2025/cu250/cu250_video.mp4
9	DS625X	ds625x	Diseñada para ser tu aliada en cualquier terreno, la Voge DS625 X combina un diseño robusto con tecnología de punta. Su potente motor de 581 cc y 63 HP te entregará la fuerza necesaria para conquistar tanto la carretera como los caminos off-road. Equipada con suspensiones KYB ajustables, frenos Nissin con ABS desconectable y control de tracción, tendrás el dominio total en cada ruta. Su avanzada pantalla LCD con navegación te guiará hacia nuevos horizontes.	6990000.00	2026	motos/ds625x.webp	t	t	2026-03-16 00:12:49.521772+00	1		disponible	9	4	motos/ds625xmaletas.webp	t	7990000.00	7490000.00	8490000.00	https://cdn.rsltda.cl/voge/modelos/2026/ds625x/ds625x.mp4
16	AC525	ac525	La Voge AC525 representa el concepto Clásico Avanzado, uniendo la elegancia atemporal del diseño retro con tecnología de vanguardia. Su motor bicilíndrico KEL500F entrega potencia suave y control preciso, complementado por suspensiones KYB regulables y frenos Nissin que aseguran confianza en cada ruta. Equipamiento como iluminación LED, pantalla TFT con conectividad móvil y monitor de presión de neumáticos, junto a un asiento de cuero, hacen de cada viaje una experiencia única y cómoda.	5990000.00	2026	motos/ac525_EpcHUfG.webp	f	t	2026-03-25 23:54:42.98916+00	1		disponible	4	1		f	\N	6390000.00	\N	https://cdn.rsltda.cl/voge/modelos/2026/ac525/naked_1_horizontal_1.mp4
17	RR660S	rr660s	La Voge RR660S es una deportiva de alta energía con motor de 4 cilindros en línea de 662,8 cc y 99 HP, diseñada para quienes buscan potencia, velocidad y estilo. Cuenta con tecnología avanzada como ABS Bosch desactivable, control de tracción (TCS), cambio rápido y suspensiones Kayaba para un manejo preciso y seguro. Su diseño aerodinámico con detalles inspirados en MotoGP y equipamiento full LED la convierten en una moto que destaca tanto en ruta como en pista.	8490000.00	2026	motos/2560.webp	t	t	2026-03-29 18:23:47.741805+00	1		disponible	2	1		f	\N	9090000.00	\N	https://cdn.rsltda.cl/voge/modelos/2026/rr660s/660rr.mp4
11	DS900X	ds900x	La Voge DS 900X está equipada con un potente motor bicilíndrico en línea de 895 cc. Cuenta con culatas DOHC de ocho válvulas, eje de equilibrado y embrague antirrebote. Este propulsor entrega una potencia máxima de 96,5 HP a 8250 rpm y un par motor de 95 Nm a 6250 rpm. Incluye además cambio rápido QSS tanto de subida como bajada, mejorando notablemente la experiencia de conducción.	9990000.00	2026	motos/ds900x.webp	t	t	2026-03-16 00:15:40.396722+00	1		disponible	11	2		f	\N	9990000.00	\N	
\.


--
-- Data for Name: motos_seccionfichatecnica; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_seccionfichatecnica (id, nombre, orden, moto_id) FROM stdin;
\.


--
-- Data for Name: motos_tipoatributo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_tipoatributo (id, nombre, slug, orden, activo) FROM stdin;
1	MOTOR	motor	1	t
2	CARACTERISTICAS	caracteristicas	2	t
3	DIMENSIONES Y CAPACIDADES	dimensiones-y-capacidades	3	t
4	EQUIPAMIENTO	equipamiento	4	t
\.


--
-- Data for Name: motos_valoratributomoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.motos_valoratributomoto (id, valor, orden, moto_id, tipo_atributo_id, nombre, tipo_control) FROM stdin;
82	Líquida	2	5	1	Refrigeracion	texto
83	Inyección electrónica EFI	3	5	1	Alimentacion	texto
84	76 mm x 64 mm	4	5	1	Diametro x carrera	texto
85	581 cc	5	5	1	Cilindrada	texto
86	11,5:1	6	5	1	Relacion de compresion	texto
30		1	6	4	Iluminacion LED	texto
31		2	6	4	Instrumentacion TFT a color	texto
32		3	6	4	Sistema de frenos Brembo y Nissin	texto
33		4	6	4	Sistema de control de traccion	texto
34		5	6	4	Sistema Quick Shift	texto
36		7	6	4	Dos modos de conduccion	texto
37		8	6	4	Computadora de viaje	texto
38		9	6	4	Launch control	texto
39		10	6	4	Accionamiento valvula de salida de escape	texto
87	64,3 HP (48 kW) / 9000 rpm	7	5	1	Potencia Maxima	texto
89	Multidisco en baño de aceite	9	5	1	Embrague	texto
90	6 velocidades	10	5	1	Cambio	texto
91	3,8 L / 100 KM	11	5	1	Consumo homologado	texto
92	12V 10AH	12	5	1	Bateria	texto
94	Horquilla invertida KYB	2	5	2	Suspension delantera	texto
95	Monoamortiguador con sistema multienlace	3	5	2	Suspension trasera	texto
97	Pirelli GT 160/60-17	5	5	2	Neumatico trasero	texto
98	Doble disco de 298 mm con pinza Nissin de doble pistón	6	5	2	Freno delantero	texto
70		1	10	4	Iluminacion LED	texto
71		2	10	4	Instrumentacion TFT a color	texto
72		3	10	4	Sistema de frenos Brembo y Nissin	texto
73		4	10	4	Sistema de control de traccion	texto
74		5	10	4	Sistema Quick Shift	texto
77		8	10	4	Computadora de viaje	texto
78		9	10	4	Launch control	texto
79		10	10	4	Accionamiento valvula de salida de escape	texto
43	Inyección electrónica EFI	3	10	1	Alimentacion	texto
44	87 mm x 72 mm	4	10	1	Diametro x carrera	texto
45	798 cc	5	10	1	Cilindrada	texto
47	93,8 HP (70 kW) /9000rpm	7	10	1	Potencia Maxima	texto
48	81 Nm / 6500 rpm	8	10	1	Par maximo	texto
49	Multidisco en baño de aceite	9	10	1	Embrague	texto
51	5,2 L / 100 KM	11	10	1	Consumo homologado	texto
52	12V 10AH	12	10	1	Bateria	texto
53	Basculante de aleación de aluminio	1	10	2	Chasis	texto
56	Pirelli Scorpion STR 90/90-21	4	10	2	Neumatico delantero	texto
57	Pirelli Scopion STR 150/70 R18	5	10	2	Neumatico trasero	texto
58	Doble disco con pinza Nissin radial de 4 pistones. ABS desconectable	6	10	2	Freno delantero	texto
60	ABS de doble canal desconectable con control de tracción TCS	8	10	2	ABS	texto
61	2380 mm	1	10	3	Largo	texto
62	860 mm	2	10	3	Ancho	texto
64	1576 mm	4	10	3	Distancia entre ejes	texto
65	220 mm	5	10	3	Distancia al suelo	texto
66	850 mm	6	10	3	Altura asiento	texto
67	213 kg	7	10	3	Peso neto	texto
68	24L	8	10	3	Capacidad deposito	texto
75	Si	6	10	4	Toma USB	texto
76	Si	7	10	4	Dos modos de conduccion	texto
80	Nissin	11	10	4	Frenos	texto
1	Monocilíndrico de 4 tiempos	1	6	1	Tipo	texto
2	Líquida	2	6	1	Refrigeracion	texto
4	78 mm x 61,2 mm	4	6	1	Diametro x carrera	texto
5	292,4 cc	5	6	1	Cilindrada	texto
6	11:01	6	6	1	Relacion de compresion	texto
7	29 HP (21 kW) / 8500 rpm	7	6	1	Potencia Maxima	texto
8	25 Nm / 7000 rpm	8	6	1	Par maximo	texto
10	6 velocidades	10	6	1	Cambio	texto
11	3,4 L / 100 KM	11	6	1	Consumo homologado	texto
12	12V-7AH	12	6	1	Bateria	texto
13	Perimetral de acero	1	6	2	Chasis	texto
15	Suspensión trasera simple	3	6	2	Suspension trasera	texto
16	Helios a06 80/100-21	4	6	2	Neumatico delantero	texto
18	Disco simple de 256mm,pinzas Nissin de 2 pistones, ABS	6	6	2	Freno delantero	texto
20	ABS Bosch desconectable en rueda trasera	8	6	2	ABS	texto
21	2165 mm	1	6	3	Largo	texto
22	816 mm	2	6	3	Ancho	texto
23	1425 mm	3	6	3	Alto	texto
24	1470 mm	4	6	3	Distancia entre ejes	texto
25	280 mm	5	6	3	Distancia al suelo	texto
26	850 mm	6	6	3	Altura asiento	texto
28	11L	8	6	3	Capacidad deposito	texto
29	140 km/h	9	6	3	Velocidad maxima	texto
35	Si	6	6	4	Toma USB	texto
40	Nissin	11	6	4	Frenos	texto
100	ABS Bosch de doble canal	8	5	2	ABS	texto
101	2100 mm	1	5	3	Largo	texto
102	780 mm	2	5	3	Ancho	texto
103	1080 mm	3	5	3	Alto	texto
104	1445 mm	4	5	3	Distancia entre ejes	texto
110		1	5	4	Iluminacion LED	texto
111		2	5	4	Instrumentacion TFT a color	texto
112		3	5	4	Sistema de frenos Brembo y Nissin	texto
113		4	5	4	Sistema de control de traccion	texto
114		5	5	4	Sistema Quick Shift	texto
117		8	5	4	Computadora de viaje	texto
118		9	5	4	Launch control	texto
119		10	5	4	Accionamiento valvula de salida de escape	texto
105	165 mm	5	5	3	Distancia al suelo	texto
106	785 mm	6	5	3	Altura asiento	texto
107	198 kg	7	5	3	Peso neto	texto
108	16,5L	8	5	3	Capacidad deposito	texto
109	170 km/h	9	5	3	Velocidad maxima	texto
115	Si	6	5	4	Toma USB	texto
116	Si	7	5	4	Dos modos de conduccion	texto
120	Nissin	11	5	4	Frenos	texto
202	Líquida	2	12	1	Refrigeracion	texto
203	Inyección electrónica EFI	3	12	1	Alimentacion	texto
204	57,3 mm x 58 mm	4	12	1	Diametro x carrera	texto
205	149,6 cc	5	12	1	Cilindrada	texto
190		1	7	4	Iluminacion LED	texto
191		2	7	4	Instrumentacion TFT a color	texto
192		3	7	4	Sistema de frenos Brembo y Nissin	texto
193		4	7	4	Sistema de control de traccion	texto
194		5	7	4	Sistema Quick Shift	texto
195		6	7	4	Toma USB	texto
196		7	7	4	Dos modos de conduccion	texto
197		8	7	4	Computadora de viaje	texto
198		9	7	4	Launch control	texto
199		10	7	4	Accionamiento valvula de salida de escape	texto
161	Monocilíndrico de 4 tiempos	1	7	1	Tipo	texto
162	Líquida	2	7	1	Refrigeracion	texto
164	78 mm x 61,2 mm	4	7	1	Diametro x carrera	texto
165	292 cc	5	7	1	Cilindrada	texto
166	11:01	6	7	1	Relacion de compresion	texto
167	21 kW / 9000 rpm	7	7	1	Potencia Maxima	texto
168	25 Nm / 6500 rpm	8	7	1	Par maximo	texto
170	6 Velocidades	10	7	1	Cambio	texto
171	3,1 L / 100 KM	11	7	1	Consumo homologado	texto
172	12V 7AH	12	7	1	Bateria	texto
173	Chasis de aleación	1	7	2	Chasis	texto
175	Suspensión simple con basculante de estilo único	3	7	2	Suspension trasera	texto
176	110/70-17	4	7	2	Neumatico delantero	texto
177	150/60-17	5	7	2	Neumatico trasero	texto
179	Disco 220 mm, pinza de 1 pistón, ABS	7	7	2	Freno trasero	texto
180	ABS Bosch de doble canal	8	7	2	ABS	texto
181	2035 mm	1	7	3	Largo	texto
183	1360 mm	3	7	3	Alto	texto
184	1435 mm	4	7	3	Distancia entre ejes	texto
185	190 mm	5	7	3	Distancia al suelo	texto
186	810 mm	6	7	3	Altura asiento	texto
187	155 kg	7	7	3	Peso neto	texto
189	130 km/h	9	7	3	Velocidad maxima	texto
200	Voge	11	7	4	Frenos	texto
230		1	12	4	Iluminacion LED	texto
231		2	12	4	Instrumentacion TFT a color	texto
232		3	12	4	Sistema de frenos Brembo y Nissin	texto
233		4	12	4	Sistema de control de traccion	texto
234		5	12	4	Sistema Quick Shift	texto
236		7	12	4	Dos modos de conduccion	texto
237		8	12	4	Computadora de viaje	texto
238		9	12	4	Launch control	texto
239		10	12	4	Accionamiento valvula de salida de escape	texto
270		1	13	4	Iluminacion LED	texto
271		2	13	4	Instrumentacion TFT a color	texto
272		3	13	4	Sistema de frenos Brembo y Nissin	texto
273		4	13	4	Sistema de control de traccion	texto
274		5	13	4	Sistema Quick Shift	texto
276		7	13	4	Dos modos de conduccion	texto
277		8	13	4	Computadora de viaje	texto
278		9	13	4	Launch control	texto
279		10	13	4	Accionamiento valvula de salida de escape	texto
283	Inyección electrónica EFI	3	14	1	Alimentacion	texto
284	53,3 mm x 56 mm	4	14	1	Diametro x carrera	texto
285	249,9 cc	5	14	1	Cilindrada	texto
287	26,8 HP (20 kW) / 9000 rpm	7	14	1	Potencia Maxima	texto
288	23 Nm / 7000 rpm	8	14	1	Par maximo	texto
289	Multidisco en baño de aceite	9	14	1	Embrague	texto
291	3,4 L / 100 KM	11	14	1	Consumo homologado	texto
292	12V 10AH	12	14	1	Bateria	texto
293	Bastidor de aleación	1	14	2	Chasis	texto
1127		49	3	4	Interruptor parada de emergencia	texto
295	Amortiguador de doble tubo de empuje recto	3	14	2	Suspension trasera	texto
296	Helios 120/80-16	4	14	2	Neumatico delantero	texto
298	Disco simple	6	14	2	Freno delantero	texto
299	Disco simple	7	14	2	Freno trasero	texto
300	ABS con control de tracción TCS	8	14	2	ABS	texto
301	2205 mm	1	14	3	Largo	texto
302	820 mm	2	14	3	Ancho	texto
304	1460 mm	4	14	3	Distancia entre ejes	texto
305	175 mm	5	14	3	Distancia al suelo	texto
306	710 mm	6	14	3	Altura asiento	texto
307	163 kg	7	14	3	Peso neto	texto
308	15L	8	14	3	Capacidad deposito	texto
241	Monocilíndrico con 4 válvulas y de 4 tiempos	1	13	1	Tipo	texto
242	Líquida	2	13	1	Refrigeracion	texto
243	Inyección electrónica EFI	3	13	1	Alimentacion	texto
245	244,3 cc	5	13	1	Cilindrada	texto
246	11,5:1	6	13	1	Relacion de compresion	texto
247	25,5 HP 19 kW / 8000 rpm	7	13	1	Potencia Maxima	texto
248	23 Nm / 5500 rpm	8	13	1	Par maximo	texto
250	Transmisión continua CVT	10	13	1	Cambio	texto
251	3,9 L / 100 KM	11	13	1	Consumo homologado	texto
252	12V 9AH	12	13	1	Bateria	texto
253	No especificado	1	13	2	Chasis	texto
255	Tipo de empuje, recorrido de 103 mm	3	13	2	Suspension trasera	texto
256	Helios 120/70-14	4	13	2	Neumatico delantero	texto
258	Disco simple con doble pistón	6	13	2	Freno delantero	texto
259	Disco simple con doble pistón	7	13	2	Freno trasero	texto
261	2100 mm	1	13	3	Largo	texto
262	795 mm	2	13	3	Ancho	texto
263	1392 mm	3	13	3	Alto	texto
264	1525 mm	4	13	3	Distancia entre ejes	texto
265	155 mm	5	13	3	Distancia al suelo	texto
266	770 mm	6	13	3	Altura asiento	texto
267	165 kg	7	13	3	Peso neto	texto
268	14L	8	13	3	Capacidad deposito	texto
275	Si	6	13	4	Toma USB	texto
280	Voge	11	13	4	Frenos	texto
207	10,5 kW / 8500 rpm	7	12	1	Potencia Maxima	texto
208	14 Nm / 6500 rpm	8	12	1	Par maximo	texto
209	Seco	9	12	1	Embrague	texto
210	Transmisión continua CVT	10	12	1	Cambio	texto
212	12V-8AH	12	12	1	Bateria	texto
213	Tubo de acero	1	12	2	Chasis	texto
215	Tipo empuje directo, recorrido de 103 mm	3	12	2	Suspension trasera	texto
216	Cordial 110/70/14	4	12	2	Neumatico delantero	texto
217	Cordial 130/70/13	5	12	2	Neumatico trasero	texto
218	Disco simple	6	12	2	Freno delantero	texto
220	ABS Bosch de doble canal	8	12	2	ABS	texto
221	1945 mm	1	12	3	Largo	texto
222	740 mm	2	12	3	Ancho	texto
223	1265 mm	3	12	3	Alto	texto
224	1320 mm	4	12	3	Distancia entre ejes	texto
226	775 mm	6	12	3	Altura asiento	texto
227	135 kg	7	12	3	Peso neto	texto
228	8L	8	12	3	Capacidad deposito	texto
229	110 km/h	9	12	3	Velocidad maxima	texto
235	Si	6	12	4	Toma USB	texto
240	Voge	11	12	4	Frenos	texto
310		1	14	4	Iluminacion LED	texto
311		2	14	4	Instrumentacion TFT a color	texto
312		3	14	4	Sistema de frenos Brembo y Nissin	texto
313		4	14	4	Sistema de control de traccion	texto
314		5	14	4	Sistema Quick Shift	texto
316		7	14	4	Dos modos de conduccion	texto
317		8	14	4	Computadora de viaje	texto
318		9	14	4	Launch control	texto
319		10	14	4	Accionamiento valvula de salida de escape	texto
350		1	3	4	Iluminacion LED	texto
351		2	3	4	Instrumentacion TFT a color	texto
352		3	3	4	Sistema de frenos Brembo y Nissin	texto
353		4	3	4	Sistema de control de traccion	texto
354		5	3	4	Sistema Quick Shift	texto
356		7	3	4	Dos modos de conduccion	texto
357		8	3	4	Computadora de viaje	texto
358		9	3	4	Launch control	texto
359		10	3	4	Accionamiento valvula de salida de escape	texto
1282		1	16	4	Display 100% digital	texto
1283		2	16	4	Cuentakilometros total y parcial	texto
1284		3	16	4	Parabrisas regulable en altura	texto
1285		4	16	4	Medidor de combustible	texto
1288		7	16	4	Indicador de averia del ABS Bosch	texto
1290		9	16	4	Pantalla TFT	texto
1292		11	16	4	Sensor de presion neumaticos	texto
1294		13	16	4	Arranque sin llave	texto
1257	494 cc	5	16	1	Cilindrada	texto
1258	11,5:1	6	16	1	Relacion de compresion	texto
1259	53.1 HP /8500 rpm	7	16	1	Potencia Maxima	texto
1260	50,5 Nm / 7000 rpm	8	16	1	Par maximo	texto
1261	Multidisco en baño de aceite	9	16	1	Embrague	texto
1262	6 velocidades	10	16	1	Cambio	texto
1264	12V-10AH	12	16	1	Bateria	texto
1265	Multitubular	1	16	2	Chasis	texto
1266	Horquilla invertida KYB	2	16	2	Suspension delantera	texto
401	Bicilíndrico en línea de 4 válvulas	1	11	1	Tipo	texto
410	6 velocidades	10	11	1	Cambio	texto
403	Inyección electrónica EFI	3	11	1	Alimentacion	texto
409	Miltidisco en baño de aceite	9	11	1	Embrague	texto
408	95 Nm / 6250 rpm	8	11	1	Par maximo	texto
404	86 mm x 77 mm	4	11	1	Diametro x carrera	texto
406	13,1:1	6	11	1	Relacion de compresion	texto
405	895 cc	5	11	1	Cilindrada	texto
355	Si	6	3	4	Toma USB	texto
360	Voge	11	3	4	Frenos	texto
322	Líquida	2	3	1	Refrigeracion	texto
323	Inyección electrónica EFI	3	3	1	Alimentacion	texto
325	321,8 cc	5	3	1	Cilindrada	texto
326	11,2:1	6	3	1	Relacion de compresion	texto
327	40,23 HP/ 10.500 rpm	7	3	1	Potencia Maxima	texto
328	31 Nm / 9000 rpm	8	3	1	Par maximo	texto
330	6 velocidades	10	3	1	Cambio	texto
331	3,7 L / 100 KM	11	3	1	Consumo homologado	texto
332	12V 7AH	12	3	1	Bateria	texto
333	No especificado	1	3	2	Chasis	texto
335	Monoamortiguador central	3	3	2	Suspension trasera	texto
336	Cordial 110/170-17	4	3	2	Neumatico delantero	texto
337	Cordial 150/60-17	5	3	2	Neumatico trasero	texto
339	Disco 240 mm, pinza de 1 pistón, ABS Bosch	7	3	2	Freno trasero	texto
340	ABS Bosch desconectable	8	3	2	ABS	texto
341	2040 mm	1	3	3	Largo	texto
342	770 mm	2	3	3	Ancho	texto
343	1070 mm	3	3	3	Alto	texto
345	165 mm	5	3	3	Distancia al suelo	texto
346	785 mm	6	3	3	Altura asiento	texto
347	160 kg	7	3	3	Peso neto	texto
348	12,5L	8	3	3	Capacidad deposito	texto
349	150km/h	9	3	3	Velocidad maxima	texto
1267	Monoamortiguador KYB	3	16	2	Suspension trasera	texto
1269	Pirelli GT 160/60-17	5	16	2	Neumatico trasero	texto
1270	Pinzas Nissin, doble disco 298mm	6	16	2	Freno delantero	texto
1272	ABS Bosch de doble canal desconectable	8	16	2	ABS	texto
1273	2100 mm	1	16	3	Largo	texto
1274	820 mm	2	16	3	Ancho	texto
1275	1170 mm	3	16	3	Alto	texto
1277	200 mm	5	16	3	Distancia al suelo	texto
1278	790 mm	6	16	3	Altura asiento	texto
1279	185 kg	7	16	3	Peso neto	texto
1280	19L	8	16	3	Capacidad deposito	texto
1281	160 km/h	9	16	3	Velocidad maxima	texto
1286	Si	5	16	4	Reloj	texto
1287	Si	6	16	4	Indicador de averia de Inyeccion	texto
1289	Si	8	16	4	Indicador de marcha engranada	texto
1291	Si	10	16	4	Indicador de temperatura alta de motor	texto
1293	Si	12	16	4	Iluminacion Full LED	texto
315	Si	6	14	4	Toma USB	texto
320	Voge	11	14	4	Frenos	texto
482	Líquida	2	8	1	Refrigeracion	texto
483	Inyección electrónica EFI	3	8	1	Alimentacion	texto
485	292 cc	5	8	1	Cilindrada	texto
486	11:1	6	8	1	Relacion de compresion	texto
430		1	11	4	Iluminacion LED	texto
431		2	11	4	Instrumentacion TFT a color	texto
432		3	11	4	Sistema de frenos Brembo y Nissin	texto
433		4	11	4	Sistema de control de traccion	texto
435		6	11	4	Toma USB	texto
436		7	11	4	Dos modos de conduccion	texto
437		8	11	4	Computadora de viaje	texto
438		9	11	4	Launch control	texto
439		10	11	4	Accionamiento valvula de salida de escape	texto
487	21 kW / 9000 rpm	7	8	1	Potencia Maxima	texto
488	25 Nm / 6500 rpm	8	8	1	Par maximo	texto
489	No especificado	9	8	1	Embrague	texto
490	6 Velocidades	10	8	1	Cambio	texto
492	12V 7AH	12	8	1	Bateria	texto
493	Chasis de aleación	1	8	2	Chasis	texto
470		1	15	4	Iluminacion LED	texto
472		3	15	4	Sistema de frenos Brembo y Nissin	texto
474		5	15	4	Sistema Quick Shift	texto
477		8	15	4	Computadora de viaje	texto
478		9	15	4	Launch control	texto
1129		49	5	4	Interruptor parada de emergencia	texto
479		10	15	4	Accionamiento valvula de salida de escape	texto
510		1	8	4	Iluminacion LED	texto
511		2	8	4	Instrumentacion TFT a color	texto
512		3	8	4	Sistema de frenos Brembo y Nissin	texto
513		4	8	4	Sistema de control de traccion	texto
514		5	8	4	Sistema Quick Shift	texto
414	Suspensiones KYB invertidas	2	11	2	Suspension delantera	texto
415	Suspensión KYB simple	3	11	2	Suspension trasera	texto
419	Pinzas Brembo disco 240mm	7	11	2	Freno trasero	texto
418	Pinzas Brembo, doble disco 305mm	6	11	2	Freno delantero	texto
417	Pirelli Scorpion Trail II150/70-17	5	11	2	Neumatico trasero	texto
423	1580 mm	3	11	3	Alto	texto
422	873 mm	2	11	3	Ancho	texto
421	2314 mm	1	11	3	Largo	texto
424	1580 mm	4	11	3	Distancia entre ejes	texto
426	825 mm	6	11	3	Altura asiento	texto
428	17L	8	11	3	Capacidad deposito	texto
427	238 kg	7	11	3	Peso neto	texto
429	210 km/h	9	11	3	Velocidad maxima	texto
434	Si	5	11	4	Sistema Quick Shift	texto
440	Brembo	11	11	4	Frenos	texto
441	Monocilíndrico de 4 tiempos	1	15	1	Tipo	texto
442	Líquida	2	15	1	Refrigeracion	texto
443	Inyección electrónica EFI	3	15	1	Alimentacion	texto
444	72 mm x 61 mm	4	15	1	Diametro x carrera	texto
445	248 cc	5	15	1	Cilindrada	texto
447	21,5 kw / 9750 rpm	7	15	1	Potencia Maxima	texto
452	12V 7AH	12	15	1	Bateria	texto
446	10,8:1	6	15	1	Relacion de compresion	texto
453	Basculante tipo único	1	15	2	Chasis	texto
454	Suspensiones invertida de 43 mm	2	15	2	Suspension delantera	texto
455	Suspensión trasera simple con basculante de estilo único	3	15	2	Suspension trasera	texto
456	110/70-17	4	15	2	Neumatico delantero	texto
457	150/60-17	5	15	2	Neumatico trasero	texto
459	Freno de disco	7	15	2	Freno trasero	texto
460	Si	8	15	2	ABS	texto
461	1955 mm	1	15	3	Largo	texto
462	760 mm	2	15	3	Ancho	texto
463	1140 mm	3	15	3	Alto	texto
464	1360 mm	4	15	3	Distancia entre ejes	texto
466	790 mm (ajustable)	6	15	3	Altura asiento	texto
467	155 kg	7	15	3	Peso neto	texto
469	140 km / h	9	15	3	Velocidad maxima	texto
468	13 L	8	15	3	Capacidad deposito	texto
723		30	9	4	Radar	texto
494	Si	2	8	2	Suspension delantera	texto
496	110/70-17	4	8	2	Neumatico delantero	texto
497	150/60-17	5	8	2	Neumatico trasero	texto
498	Disco 300 mm, pinzas de 2 pistones, ABS	6	8	2	Freno delantero	texto
499	Disco 220 mm, pinza de 1 pistón, ABS	7	8	2	Freno trasero	texto
500	ABS Bosch de doble canal	8	8	2	ABS	texto
502	820 mm	2	8	3	Ancho	texto
503	1360 mm	3	8	3	Alto	texto
504	1435 mm	4	8	3	Distancia entre ejes	texto
505	190 mm	5	8	3	Distancia al suelo	texto
506	810 mm	6	8	3	Altura asiento	texto
508	16 L	8	8	3	Capacidad deposito	texto
509	130 km/h	9	8	3	Velocidad maxima	texto
471	Si	2	15	4	Instrumentacion TFT a color	texto
473	Si	4	15	4	Sistema de control de traccion	texto
475	Si	6	15	4	Toma USB	texto
476	Si	7	15	4	Dos modos de conduccion	texto
480	Voge	11	15	4	Frenos	texto
516		7	8	4	Dos modos de conduccion	texto
517		8	8	4	Computadora de viaje	texto
518		9	8	4	Launch control	texto
519		10	8	4	Accionamiento valvula de salida de escape	texto
1295		14	16	4	Control crucero	texto
520	Voge	11	8	4	Frenos	texto
550		1	9	4	Iluminacion LED	texto
551		2	9	4	Instrumentacion TFT a color	texto
552		3	9	4	Sistema de frenos Brembo y Nissin	texto
553		4	9	4	Sistema de control de traccion	texto
554		5	9	4	Sistema Quick Shift	texto
555		6	9	4	Toma USB	texto
557		8	9	4	Computadora de viaje	texto
558		9	9	4	Launch control	texto
559		10	9	4	Accionamiento valvula de salida de escape	texto
412	12V 10AH	12	11	1	Bateria	texto
402	Líquida	2	11	1	Refrigeracion	texto
411	4,9 L / 100 KM	11	11	1	Consumo homologado	texto
407	96,5 HP (70 kW) / 8250 rpm	7	11	1	Potencia Maxima	texto
413	Basculante de aleación de aluminio	1	11	2	Chasis	texto
420	ABS Bosch IMU de doble canal desconectable	8	11	2	ABS	texto
416	Pirelli Scorpio Trail II 90/90-21	4	11	2	Neumatico delantero	texto
425	190 mm	5	11	3	Distancia al suelo	texto
590	Si	2	11	4	Cuentakilometros total y parcial	texto
591	Si	3	11	4	Parabrisas regulable en altura	texto
592	Si	4	11	4	Medidor de combustible	texto
593	Si	5	11	4	Indicador de averia de Inyeccion	texto
521	Bicilíndrico de 8 válvulas, DOHC	1	9	1	Tipo	texto
522	Líquida	2	9	1	Refrigeracion	texto
524	76 mm x 64 mm	4	9	1	Diametro x carrera	texto
525	581 cc	5	9	1	Cilindrada	texto
526	11,5:1	6	9	1	Relacion de compresion	texto
527	63 HP ( 47 kW) / 9000 rpm	7	9	1	Potencia Maxima	texto
529	Multidisco en baño de aceite	9	9	1	Embrague	texto
530	6 velocidades	10	9	1	Cambio	texto
532	12V 10AH	12	9	1	Bateria	texto
533	Basculante de diseño único, llantas de radios y barra protectora delantera.	1	9	2	Chasis	texto
535	Monoamortiguador central	3	9	2	Suspension trasera	texto
536	Tubeless Metzeler Tourance – 110/80R19	4	9	2	Neumatico delantero	texto
538	Doble disco de 298 mm con pinza Nissin de doble pistón	6	9	2	Freno delantero	texto
540	ABS Bosch de doble canal	8	9	2	ABS	texto
541	2230 mm	1	9	3	Largo	texto
542	860 mm	2	9	3	Ancho	texto
543	1390 mm	3	9	3	Alto	texto
544	1465 mm	4	9	3	Distancia entre ejes	texto
545	220 mm	5	9	3	Distancia al suelo	texto
546	835 mm	6	9	3	Altura asiento	texto
548	17,6L	8	9	3	Capacidad deposito	texto
549	183 km/h	9	9	3	Velocidad maxima	texto
556	Si	7	9	4	Dos modos de conduccion	texto
560	Nissin	11	9	4	Frenos	texto
589	Si	1	11	4	Display 100% digital	texto
616	Si	28	11	4	Anti Shimmy	texto
615	Si	27	11	4	Radar	texto
614	Si	26	11	4	Interruptor de caballete lateral	texto
594	Si	6	11	4	Indicador de averia del ABS Bosch	texto
596	Si	8	11	4	Pantalla TFT	texto
595	Si	7	11	4	Indicador de marcha engranada	texto
613	Si	25	11	4	Faros Auxiliares	texto
612	Si	24	11	4	Juego de herramientas	texto
611	Si	23	11	4	Defensas laterales	texto
597	Si	9	11	4	Indicador de temperatura alta de motor	texto
610	Si	22	11	4	Neblineros integrados	texto
609	Si	21	11	4	Parrilla trasera	texto
599	Si	11	11	4	Iluminacion Full LED	texto
608	Si	20	11	4	TCS Desconectable	texto
600	Si	12	11	4	Arranque sin llave	texto
607	Si	19	11	4	Camara frontal	texto
601	Si	13	11	4	Control crucero	texto
606	Si	18	11	4	Toma 12V, USB y USB-C	texto
602	Si	14	11	4	Cubre Punos	texto
605	Si	17	11	4	Calefaccion en punos	texto
603	Si	15	11	4	Bluetooth	texto
604	Si	16	11	4	Calefaccion en asiento	texto
617		1	10	4	Display 100% digital	texto
618		2	10	4	Cuentakilometros total y parcial	texto
619		3	10	4	Parabrisas regulable en altura	texto
620		4	10	4	Medidor de combustible	texto
621		5	10	4	Indicador de averia de Inyeccion	texto
622		6	10	4	Indicador de averia del ABS Bosch	texto
623		7	10	4	Indicador de marcha engranada	texto
625		9	10	4	Indicador de temperatura alta de motor	texto
626		10	10	4	Sensor de presion neumaticos	texto
627		11	10	4	Iluminacion Full LED	texto
628		12	10	4	Arranque sin llave	texto
629		13	10	4	Control crucero	texto
630		14	10	4	Cubre Punos	texto
631		15	10	4	Bluetooth	texto
634		18	10	4	Toma 12V, USB y USB-C	texto
635		19	10	4	Camara frontal	texto
636		20	10	4	TCS Desconectable	texto
639		23	10	4	Defensas laterales	texto
640		24	10	4	Juego de herramientas	texto
641		25	10	4	Faros Auxiliares	texto
642		26	10	4	Interruptor de caballete lateral	texto
643		27	10	4	Radar	texto
644		28	10	4	Anti Shimmy	texto
645		1	15	4	Display 100% digital	texto
646		2	15	4	Cuentakilometros total y parcial	texto
647		3	15	4	Parabrisas regulable en altura	texto
649		5	15	4	Indicador de averia de Inyeccion	texto
650		6	15	4	Indicador de averia del ABS Bosch	texto
651		7	15	4	Indicador de marcha engranada	texto
652		8	15	4	Pantalla TFT	texto
653		9	15	4	Indicador de temperatura alta de motor	texto
654		10	15	4	Sensor de presion neumaticos	texto
656		12	15	4	Arranque sin llave	texto
657		13	15	4	Control crucero	texto
658		14	15	4	Cubre Punos	texto
659		15	15	4	Bluetooth	texto
660		16	15	4	Calefaccion en asiento	texto
661		17	15	4	Calefaccion en punos	texto
662		18	15	4	Toma 12V, USB y USB-C	texto
663		19	15	4	Camara frontal	texto
664		20	15	4	TCS Desconectable	texto
665		21	15	4	Parrilla trasera	texto
666		22	15	4	Neblineros integrados	texto
598	Si	10	11	4	Sensor de presion neumaticos	texto
624	Si	8	10	4	Pantalla TFT	texto
632	Si	16	10	4	Calefaccion en asiento	texto
633	Si	17	10	4	Calefaccion en punos	texto
637	Si	21	10	4	Parrilla trasera	texto
638	Si	22	10	4	Neblineros integrados	texto
1296		15	16	4	Cubre Punos	texto
1298		17	16	4	Conectividad Bluetooth y Navegacion	texto
1299		18	16	4	Luces de emergencia (Hazard)	texto
1300		19	16	4	Calefaccion en asiento	texto
1301		20	16	4	Calefaccion en punos	texto
1302		21	16	4	Toma 12V, USB y USB-C	texto
1303		22	16	4	Camara frontal	texto
1304		23	16	4	TCS Desconectable	texto
1305		24	16	4	Parrilla trasera	texto
1306		25	16	4	Neblineros integrados	texto
1307		26	16	4	Defensas laterales	texto
1309		28	16	4	Faros Auxiliares	texto
1311		30	16	4	Radar	texto
1312		31	16	4	Anti Shimmy	texto
1313		32	16	4	Sistema Quick Shift	texto
1315	Si	29	10	4	Pantalla  TFT	texto
1396		1	13	4	Display 100% digital	texto
1308	Si	27	16	4	Juego de herramientas	texto
1314	Nissin	33	16	4	Frenos	texto
648	Si	4	15	4	Medidor de combustible	texto
655	Si	11	15	4	Iluminacion Full LED	texto
667		23	15	4	Defensas laterales	texto
669		25	15	4	Faros Auxiliares	texto
671		27	15	4	Radar	texto
672		28	15	4	Anti Shimmy	texto
450	6 velocidades	10	15	1	Cambio	texto
451	3.6L/100km	11	15	1	Consumo homologado	texto
449	Antirrebote	9	15	1	Embrague	texto
448	23 Nm / 7500 rpm	8	15	1	Par maximo	texto
458	Freno de disco	6	15	2	Freno delantero	texto
465	150 mm	5	15	3	Distancia al suelo	texto
705	Si	12	9	4	Iluminacion Full LED	texto
717	Si	24	9	4	Parrilla trasera	texto
718	Si	25	9	4	Neblineros integrados	texto
1253	Bicilíndrico de 4 tiempos	1	16	1	Tipo	texto
1316		1	16	4	Iluminacion LED	texto
1317		2	16	4	Instrumentacion TFT a color	texto
676		5	11	4	Reloj	texto
677		17	11	4	Conectividad Bluetooth y Navegacion	texto
678		18	11	4	Luces de emergencia (Hazard)	texto
679		5	10	4	Reloj	texto
680		17	10	4	Conectividad Bluetooth y Navegacion	texto
681		18	10	4	Luces de emergencia (Hazard)	texto
682	Si	29	11	4	Pantalla  TFT	texto
41	Bicilíndrico en línea, 8 válvulas y doble árbol de levas en cabeza (DOHC).	1	10	1	Tipo	texto
42	Líquida	2	10	1	Refrigeracion	texto
46	12:01	6	10	1	Relacion de compresion	texto
50	6 velocidades	10	10	1	Cambio	texto
54	Horquilla invertida KYB ajustable	2	10	2	Suspension delantera	texto
55	Monoamortiguador KYB cons sistema multienlace, con ajuste precarga y amortiguación	3	10	2	Suspension trasera	texto
59	Disco con pinza simple pistón. ABS desconectable	7	10	2	Freno trasero	texto
63	1399 mm	3	10	3	Alto	texto
69	190 km/h	9	10	3	Velocidad maxima	texto
683	Si	29	10	4	Control de tracción TCS desconectable	texto
684	Si	30	10	4	Alerta de frenada de emergencia ESS	texto
685	Si	31	10	4	Alumbrado Full Led	texto
686	Si	32	10	4	Paramanos	texto
687	Si	33	10	4	Llantas tubeless de radios cruzados	texto
688	Si	34	10	4	Punteras de cambio y freno articuladas	texto
689	Si	35	10	4	Cámara frontal HD	texto
690	Si	36	10	4	Caballete central	texto
691	Si	37	10	4	Defensas	texto
692	Si	38	10	4	Cubrecárter	texto
693	Si	39	10	4	Conectividad	texto
694		1	9	4	Display 100% digital	texto
695		2	9	4	Cuentakilometros total y parcial	texto
696		3	9	4	Parabrisas regulable en altura	texto
697		4	9	4	Medidor de combustible	texto
698		5	9	4	Reloj	texto
699		6	9	4	Indicador de averia de Inyeccion	texto
700		7	9	4	Indicador de averia del ABS Bosch	texto
701		8	9	4	Indicador de marcha engranada	texto
702		9	9	4	Pantalla TFT	texto
703		10	9	4	Indicador de temperatura alta de motor	texto
704		11	9	4	Sensor de presion neumaticos	texto
706		13	9	4	Arranque sin llave	texto
707		14	9	4	Control crucero	texto
708		15	9	4	Cubre Punos	texto
709		16	9	4	Bluetooth	texto
710		17	9	4	Conectividad Bluetooth y Navegacion	texto
711		18	9	4	Luces de emergencia (Hazard)	texto
712		19	9	4	Calefaccion en asiento	texto
713		20	9	4	Calefaccion en punos	texto
714		21	9	4	Toma 12V, USB y USB-C	texto
715		22	9	4	Camara frontal	texto
716		23	9	4	TCS Desconectable	texto
719		26	9	4	Defensas laterales	texto
720		27	9	4	Juego de herramientas	texto
721		28	9	4	Faros Auxiliares	texto
722		29	9	4	Interruptor de caballete lateral	texto
1318		3	16	4	Sistema de frenos Brembo y Nissin	texto
1319		4	16	4	Sistema de control de traccion	texto
1320	Si	6	16	4	Toma USB	texto
1321		7	16	4	Dos modos de conduccion	texto
1322		8	16	4	Computadora de viaje	texto
1323		9	16	4	Launch control	texto
1324		10	16	4	Accionamiento valvula de salida de escape	texto
1327		29	16	4	Alumbrado Full Led	texto
1332		34	16	4	Parabrisas regulable	texto
1481		55	3	4	Balizas	texto
1328		30	16	4	Alerta de frenada de emergencia ESS	texto
1329		32	16	4	Paramanos	texto
1330		33	16	4	Llantas tubeless de radios cruzados	texto
1331		34	16	4	Punteras de cambio y freno articuladas	texto
1333		35	16	4	Cámara frontal HD	texto
668	Si	24	15	4	Juego de herramientas	texto
670	Si	26	15	4	Interruptor de caballete lateral	texto
724		31	9	4	Anti Shimmy	texto
523	Inyección electrónica EFI	3	9	1	Alimentacion	texto
528	57 Nm / 6500 rpm	8	9	1	Par maximo	texto
531	3,8 L / 100 KM	11	9	1	Consumo homologado	texto
534	Horquilla invertida	2	9	2	Suspension delantera	texto
537	Tubeless Metzeler Tourance – 150/70R17	5	9	2	Neumatico trasero	texto
539	Disco 240 mm con pinza simple pistón	7	9	2	Freno trasero	texto
547	206 kg	7	9	3	Peso neto	texto
726		29	11	4	Alumbrado Full Led	texto
727		29	9	4	Alumbrado Full Led	texto
728		29	7	4	Alumbrado Full Led	texto
729		29	6	4	Alumbrado Full Led	texto
730		29	3	4	Alumbrado Full Led	texto
1254	Líquida	2	16	1	Refrigeracion	texto
732		29	5	4	Alumbrado Full Led	texto
733		29	8	4	Alumbrado Full Led	texto
734		29	12	4	Alumbrado Full Led	texto
735		29	13	4	Alumbrado Full Led	texto
736		29	14	4	Alumbrado Full Led	texto
737		29	15	4	Alumbrado Full Led	texto
739		30	11	4	Alerta de frenada de emergencia ESS	texto
740		30	9	4	Alerta de frenada de emergencia ESS	texto
741		30	7	4	Alerta de frenada de emergencia ESS	texto
742		30	6	4	Alerta de frenada de emergencia ESS	texto
743		30	3	4	Alerta de frenada de emergencia ESS	texto
1334		35	16	4	Manetas regulables	texto
745		30	5	4	Alerta de frenada de emergencia ESS	texto
746		30	8	4	Alerta de frenada de emergencia ESS	texto
747		30	12	4	Alerta de frenada de emergencia ESS	texto
748		30	13	4	Alerta de frenada de emergencia ESS	texto
749		30	14	4	Alerta de frenada de emergencia ESS	texto
750		30	15	4	Alerta de frenada de emergencia ESS	texto
752		31	11	4	Control de tracción TCS desconectable	texto
754		31	7	4	Control de tracción TCS desconectable	texto
755		31	6	4	Control de tracción TCS desconectable	texto
756		31	3	4	Control de tracción TCS desconectable	texto
1336		36	16	4	Toma USB y 12V	texto
759		31	8	4	Control de tracción TCS desconectable	texto
760		31	12	4	Control de tracción TCS desconectable	texto
761		31	13	4	Control de tracción TCS desconectable	texto
762		31	14	4	Control de tracción TCS desconectable	texto
763		31	15	4	Control de tracción TCS desconectable	texto
765		32	11	4	Paramanos	texto
767		32	7	4	Paramanos	texto
768		32	6	4	Paramanos	texto
769		32	3	4	Paramanos	texto
771		32	5	4	Paramanos	texto
772		32	8	4	Paramanos	texto
773		32	12	4	Paramanos	texto
774		32	13	4	Paramanos	texto
775		32	14	4	Paramanos	texto
776		32	15	4	Paramanos	texto
778		33	11	4	Llantas tubeless de radios cruzados	texto
780		33	7	4	Llantas tubeless de radios cruzados	texto
781		33	6	4	Llantas tubeless de radios cruzados	texto
782		33	3	4	Llantas tubeless de radios cruzados	texto
784		33	5	4	Llantas tubeless de radios cruzados	texto
785		33	8	4	Llantas tubeless de radios cruzados	texto
786		33	12	4	Llantas tubeless de radios cruzados	texto
787		33	13	4	Llantas tubeless de radios cruzados	texto
788		33	14	4	Llantas tubeless de radios cruzados	texto
789		33	15	4	Llantas tubeless de radios cruzados	texto
791		34	11	4	Parabrisas regulable	texto
792		34	10	4	Parabrisas regulable	texto
794		34	7	4	Parabrisas regulable	texto
795		34	6	4	Parabrisas regulable	texto
796		34	3	4	Parabrisas regulable	texto
798		34	5	4	Parabrisas regulable	texto
799		34	8	4	Parabrisas regulable	texto
800		34	12	4	Parabrisas regulable	texto
801		34	13	4	Parabrisas regulable	texto
802		34	14	4	Parabrisas regulable	texto
803		34	15	4	Parabrisas regulable	texto
805		35	11	4	Manetas regulables	texto
766	Si	32	9	4	Paramanos	texto
779	Si	33	9	4	Llantas tubeless de radios cruzados	texto
793	Si	34	9	4	Parabrisas regulable	texto
1337		37	16	4	Defensas	texto
1338		38	16	4	Cubrecárter	texto
1339		39	16	4	Conectividad	texto
1340	Si	40	16	4	Velocímetro digital	texto
758	Si	31	5	4	Control de tracción TCS desconectable	texto
806		35	10	4	Manetas regulables	texto
808		35	7	4	Manetas regulables	texto
809		35	6	4	Manetas regulables	texto
810		35	3	4	Manetas regulables	texto
1255	Inyección electrónica EFI	3	16	1	Alimentacion	texto
813		35	8	4	Manetas regulables	texto
814		35	12	4	Manetas regulables	texto
815		35	13	4	Manetas regulables	texto
816		35	14	4	Manetas regulables	texto
817		35	15	4	Manetas regulables	texto
819		36	11	4	Toma USB y 12V	texto
820		36	10	4	Toma USB y 12V	texto
822		36	7	4	Toma USB y 12V	texto
823		36	6	4	Toma USB y 12V	texto
824		36	3	4	Toma USB y 12V	texto
826		36	5	4	Toma USB y 12V	texto
827		36	8	4	Toma USB y 12V	texto
828		36	12	4	Toma USB y 12V	texto
829		36	13	4	Toma USB y 12V	texto
830		36	14	4	Toma USB y 12V	texto
831		36	15	4	Toma USB y 12V	texto
833		37	11	4	Cámara frontal HD	texto
835		37	7	4	Cámara frontal HD	texto
836		37	6	4	Cámara frontal HD	texto
837		37	3	4	Cámara frontal HD	texto
1342		42	16	4	Cuenta revoluciones digital	texto
839		37	5	4	Cámara frontal HD	texto
840		37	8	4	Cámara frontal HD	texto
841		37	12	4	Cámara frontal HD	texto
842		37	13	4	Cámara frontal HD	texto
843		37	14	4	Cámara frontal HD	texto
844		37	15	4	Cámara frontal HD	texto
846		38	11	4	Caballete central	texto
849		38	6	4	Caballete central	texto
852		38	5	4	Caballete central	texto
853		38	8	4	Caballete central	texto
855		38	13	4	Caballete central	texto
856		38	14	4	Caballete central	texto
857		38	15	4	Caballete central	texto
859		39	11	4	Defensas	texto
861		39	7	4	Defensas	texto
862		39	6	4	Defensas	texto
863		39	3	4	Defensas	texto
1344		44	16	4	Indicador de avería de ABS Bosch	texto
865		39	5	4	Defensas	texto
866		39	8	4	Defensas	texto
867		39	12	4	Defensas	texto
868		39	13	4	Defensas	texto
869		39	14	4	Defensas	texto
870		39	15	4	Defensas	texto
753	Si	31	9	4	Control de tracción TCS desconectable	texto
807	Si	35	9	4	Manetas regulables	texto
821	Si	36	9	4	Toma USB y 12V	texto
834	Si	37	9	4	Cámara frontal HD	texto
847	Si	38	9	4	Caballete central	texto
860	Si	39	9	4	Defensas	texto
871		1	7	4	Display 100% digital	texto
872		2	7	4	Cuentakilometros total y parcial	texto
873		3	7	4	Parabrisas regulable en altura	texto
874		4	7	4	Medidor de combustible	texto
875		5	7	4	Reloj	texto
879		9	7	4	Pantalla TFT	texto
880		10	7	4	Indicador de temperatura alta de motor	texto
881		11	7	4	Sensor de presion neumaticos	texto
883		13	7	4	Arranque sin llave	texto
884		14	7	4	Control crucero	texto
885		15	7	4	Cubre Punos	texto
886		16	7	4	Bluetooth	texto
887		17	7	4	Conectividad Bluetooth y Navegacion	texto
888		18	7	4	Luces de emergencia (Hazard)	texto
889		19	7	4	Calefaccion en asiento	texto
890		20	7	4	Calefaccion en punos	texto
891		21	7	4	Toma 12V, USB y USB-C	texto
892		22	7	4	Camara frontal	texto
893		23	7	4	TCS Desconectable	texto
895		25	7	4	Neblineros integrados	texto
896		26	7	4	Defensas laterales	texto
898		28	7	4	Faros Auxiliares	texto
850	Si	38	3	4	Caballete central	texto
876	Si	6	7	4	Indicador de averia de Inyeccion	texto
877	Si	7	7	4	Indicador de averia del ABS Bosch	texto
878	Si	8	7	4	Indicador de marcha engranada	texto
882	Si	12	7	4	Iluminacion Full LED	texto
894	Si	24	7	4	Parrilla trasera	texto
897	Si	27	7	4	Juego de herramientas	texto
848	Si	38	7	4	Caballete central	texto
1346		46	16	4	Indicador de avería del ABS	texto
1347		47	16	4	Indicador check engine	texto
1343	Si	43	16	4	Medidor de combustible digital	texto
1345	Si	45	16	4	Luz de sobrepaso	texto
812	Si	35	5	4	Manetas regulables	texto
854	Si	38	12	4	Caballete central	texto
899		29	7	4	Interruptor de caballete lateral	texto
900		30	7	4	Radar	texto
901		31	7	4	Anti Shimmy	texto
163	Inyección electrónica EFI	3	7	1	Alimentacion	texto
169	No especificado	9	7	1	Embrague	texto
174	Si	2	7	2	Suspension delantera	texto
178	Disco 300 mm, pinzas de 2 pistones, ABS	6	7	2	Freno delantero	texto
182	820 mm	2	7	3	Ancho	texto
188	16 L	8	7	3	Capacidad deposito	texto
903		40	11	4	Velocímetro digital	texto
904		40	10	4	Velocímetro digital	texto
905		40	9	4	Velocímetro digital	texto
1256	68 mm x 68 mm	4	16	1	Diametro x carrera	texto
910		40	5	4	Velocímetro digital	texto
915		40	15	4	Velocímetro digital	texto
917		41	11	4	Cuentakilómetros total y parcial digital	texto
918		41	10	4	Cuentakilómetros total y parcial digital	texto
919		41	9	4	Cuentakilómetros total y parcial digital	texto
1348		48	16	4	Pantalla digital	texto
924		41	5	4	Cuentakilómetros total y parcial digital	texto
929		41	15	4	Cuentakilómetros total y parcial digital	texto
931		42	11	4	Cuenta revoluciones digital	texto
932		42	10	4	Cuenta revoluciones digital	texto
933		42	9	4	Cuenta revoluciones digital	texto
1349		49	16	4	Interruptor parada de emergencia	texto
938		42	5	4	Cuenta revoluciones digital	texto
943		42	15	4	Cuenta revoluciones digital	texto
945		43	11	4	Medidor de combustible digital	texto
946		43	10	4	Medidor de combustible digital	texto
947		43	9	4	Medidor de combustible digital	texto
952		43	5	4	Medidor de combustible digital	texto
957		43	15	4	Medidor de combustible digital	texto
959		44	11	4	Indicador de avería de ABS Bosch	texto
960		44	10	4	Indicador de avería de ABS Bosch	texto
961		44	9	4	Indicador de avería de ABS Bosch	texto
963		44	6	4	Indicador de avería de ABS Bosch	texto
1351		51	16	4	Estriberas tipo enduro	texto
966		44	5	4	Indicador de avería de ABS Bosch	texto
967		44	8	4	Indicador de avería de ABS Bosch	texto
968		44	12	4	Indicador de avería de ABS Bosch	texto
969		44	13	4	Indicador de avería de ABS Bosch	texto
971		44	15	4	Indicador de avería de ABS Bosch	texto
972		1	3	4	Display 100% digital	texto
973		2	3	4	Cuentakilometros total y parcial	texto
974		3	3	4	Parabrisas regulable en altura	texto
975		4	3	4	Medidor de combustible	texto
906	Si	40	7	4	Velocímetro digital	texto
908	Si	40	3	4	Velocímetro digital	texto
922	Si	41	3	4	Cuentakilómetros total y parcial digital	texto
936	Si	42	3	4	Cuenta revoluciones digital	texto
950	Si	43	3	4	Medidor de combustible digital	texto
964	Si	44	3	4	Indicador de avería de ABS Bosch	texto
978		7	3	4	Indicador de averia del ABS Bosch	texto
920	Si	41	7	4	Cuentakilómetros total y parcial digital	texto
934	Si	42	7	4	Cuenta revoluciones digital	texto
948	Si	43	7	4	Medidor de combustible digital	texto
962	Si	44	7	4	Indicador de avería de ABS Bosch	texto
907	Si	40	6	4	Velocímetro digital	texto
921	Si	41	6	4	Cuentakilómetros total y parcial digital	texto
935	Si	42	6	4	Cuenta revoluciones digital	texto
949	Si	43	6	4	Medidor de combustible digital	texto
976	Si	5	3	4	Reloj	texto
1352	Si	52	16	4	Palanca de freno ajustable	texto
911	Si	40	8	4	Velocímetro digital	texto
925	Si	41	8	4	Cuentakilómetros total y parcial digital	texto
939	Si	42	8	4	Cuenta revoluciones digital	texto
953	Si	43	8	4	Medidor de combustible digital	texto
914	Si	40	14	4	Velocímetro digital	texto
942	Si	42	14	4	Cuenta revoluciones digital	texto
956	Si	43	14	4	Medidor de combustible digital	texto
970	Si	44	14	4	Indicador de avería de ABS Bosch	texto
913	Si	40	13	4	Velocímetro digital	texto
927	Si	41	13	4	Cuentakilómetros total y parcial digital	texto
941	Si	42	13	4	Cuenta revoluciones digital	texto
955	Si	43	13	4	Medidor de combustible digital	texto
912	Si	40	12	4	Velocímetro digital	texto
926	Si	41	12	4	Cuentakilómetros total y parcial digital	texto
940	Si	42	12	4	Cuenta revoluciones digital	texto
954	Si	43	12	4	Medidor de combustible digital	texto
980		9	3	4	Pantalla TFT	texto
982		11	3	4	Sensor de presion neumaticos	texto
984		13	3	4	Arranque sin llave	texto
985		14	3	4	Control crucero	texto
986		15	3	4	Cubre Punos	texto
988		17	3	4	Conectividad Bluetooth y Navegacion	texto
989		18	3	4	Luces de emergencia (Hazard)	texto
990		19	3	4	Calefaccion en asiento	texto
991		20	3	4	Calefaccion en punos	texto
992		21	3	4	Toma 12V, USB y USB-C	texto
993		22	3	4	Camara frontal	texto
994		23	3	4	TCS Desconectable	texto
996		25	3	4	Neblineros integrados	texto
997		26	3	4	Defensas laterales	texto
999		28	3	4	Faros Auxiliares	texto
1001		30	3	4	Radar	texto
1002		31	3	4	Anti Shimmy	texto
1004		45	11	4	Luz de sobrepaso	texto
1005		45	10	4	Luz de sobrepaso	texto
1006		45	9	4	Luz de sobrepaso	texto
1263	4,4 L / 100 KM	11	16	1	Consumo homologado	texto
1011		45	5	4	Luz de sobrepaso	texto
1016		45	15	4	Luz de sobrepaso	texto
977	Si	6	3	4	Indicador de averia de Inyeccion	texto
979	Si	8	3	4	Indicador de marcha engranada	texto
981	Si	10	3	4	Indicador de temperatura alta de motor	texto
983	Si	12	3	4	Iluminacion Full LED	texto
995	Si	24	3	4	Parrilla trasera	texto
998	Si	27	3	4	Juego de herramientas	texto
1009	Si	45	3	4	Luz de sobrepaso	texto
1017		1	5	4	Display 100% digital	texto
1018		2	5	4	Cuentakilometros total y parcial	texto
1019		3	5	4	Parabrisas regulable en altura	texto
1021		5	5	4	Reloj	texto
1022		6	5	4	Indicador de averia de Inyeccion	texto
1023		7	5	4	Indicador de averia del ABS Bosch	texto
1024		8	5	4	Indicador de marcha engranada	texto
1026		10	5	4	Indicador de temperatura alta de motor	texto
1027		11	5	4	Sensor de presion neumaticos	texto
1029		13	5	4	Arranque sin llave	texto
1030		14	5	4	Control crucero	texto
1031		15	5	4	Cubre Punos	texto
1032		16	5	4	Bluetooth	texto
1033		17	5	4	Conectividad Bluetooth y Navegacion	texto
1034		18	5	4	Luces de emergencia (Hazard)	texto
1035		19	5	4	Calefaccion en asiento	texto
1036		20	5	4	Calefaccion en punos	texto
1037		21	5	4	Toma 12V, USB y USB-C	texto
1038		22	5	4	Camara frontal	texto
1039		23	5	4	TCS Desconectable	texto
1040		24	5	4	Parrilla trasera	texto
1041		25	5	4	Neblineros integrados	texto
1042		26	5	4	Defensas laterales	texto
1043		27	5	4	Juego de herramientas	texto
1044		28	5	4	Faros Auxiliares	texto
1045		29	5	4	Interruptor de caballete lateral	texto
1046		30	5	4	Radar	texto
1047		31	5	4	Anti Shimmy	texto
1048		1	6	4	Display 100% digital	texto
1049		2	6	4	Cuentakilometros total y parcial	texto
1050		3	6	4	Parabrisas regulable en altura	texto
1051		4	6	4	Medidor de combustible	texto
1052		5	6	4	Reloj	texto
1053		6	6	4	Indicador de averia de Inyeccion	texto
1054		7	6	4	Indicador de averia del ABS Bosch	texto
1056		9	6	4	Pantalla TFT	texto
1058		11	6	4	Sensor de presion neumaticos	texto
1060		13	6	4	Arranque sin llave	texto
1061		14	6	4	Control crucero	texto
1062		15	6	4	Cubre Punos	texto
1063		16	6	4	Bluetooth	texto
1064		17	6	4	Conectividad Bluetooth y Navegacion	texto
1065		18	6	4	Luces de emergencia (Hazard)	texto
1066		19	6	4	Calefaccion en asiento	texto
1007	Si	45	7	4	Luz de sobrepaso	texto
1055	Si	8	6	4	Indicador de marcha engranada	texto
1057	Si	10	6	4	Indicador de temperatura alta de motor	texto
1059	Si	12	6	4	Iluminacion Full LED	texto
1008	Si	45	6	4	Luz de sobrepaso	texto
987	Si	16	3	4	Bluetooth	texto
1000	Si	29	3	4	Interruptor de caballete lateral	texto
1397		2	13	4	Cuentakilometros total y parcial	texto
1398		3	13	4	Parabrisas regulable en altura	texto
1399		4	13	4	Medidor de combustible	texto
1020	Si	4	5	4	Medidor de combustible	texto
1025	Si	9	5	4	Pantalla TFT	texto
1028	Si	12	5	4	Iluminacion Full LED	texto
1012	Si	45	8	4	Luz de sobrepaso	texto
1015	Si	45	14	4	Luz de sobrepaso	texto
1400	Si	5	13	4	Reloj	texto
1014	Si	45	13	4	Luz de sobrepaso	texto
1013	Si	45	12	4	Luz de sobrepaso	texto
1067		20	6	4	Calefaccion en punos	texto
1068		21	6	4	Toma 12V, USB y USB-C	texto
1069		22	6	4	Camara frontal	texto
1070		23	6	4	TCS Desconectable	texto
1268	Pirelli GT 120/70-17	4	16	2	Neumatico delantero	texto
1072		25	6	4	Neblineros integrados	texto
1075		28	6	4	Faros Auxiliares	texto
1077		30	6	4	Radar	texto
1078		31	6	4	Anti Shimmy	texto
3	Inyección electrónica EFI	3	6	1	Alimentacion	texto
9	Multidisco en baño de aceite	9	6	1	Embrague	texto
14	Suspensión invertida	2	6	2	Suspension delantera	texto
17	Helios 120/90-18	5	6	2	Neumatico trasero	texto
19	Disco simple de 220mm, pinza Nissin de 1 pistón, ABS Desconectable	7	6	2	Freno trasero	texto
27	160 kg	7	6	3	Peso neto	texto
1080		46	11	4	Indicador de avería del ABS	texto
1081		46	10	4	Indicador de avería del ABS	texto
1082		46	9	4	Indicador de avería del ABS	texto
1083		46	7	4	Indicador de avería del ABS	texto
1085		46	3	4	Indicador de avería del ABS	texto
1087		46	5	4	Indicador de avería del ABS	texto
1088		46	8	4	Indicador de avería del ABS	texto
1089		46	12	4	Indicador de avería del ABS	texto
1090		46	13	4	Indicador de avería del ABS	texto
1091		46	14	4	Indicador de avería del ABS	texto
1092		46	15	4	Indicador de avería del ABS	texto
1094		47	11	4	Indicador check engine	texto
1095		47	10	4	Indicador check engine	texto
1096		47	9	4	Indicador check engine	texto
1097		47	7	4	Indicador check engine	texto
1099		47	3	4	Indicador check engine	texto
1101		47	5	4	Indicador check engine	texto
1102		47	8	4	Indicador check engine	texto
1103		47	12	4	Indicador check engine	texto
1104		47	13	4	Indicador check engine	texto
1105		47	14	4	Indicador check engine	texto
1106		47	15	4	Indicador check engine	texto
1108		48	11	4	Pantalla digital	texto
1109		48	10	4	Pantalla digital	texto
1110		48	9	4	Pantalla digital	texto
1111		48	7	4	Pantalla digital	texto
1113		48	3	4	Pantalla digital	texto
1115		48	5	4	Pantalla digital	texto
1116		48	8	4	Pantalla digital	texto
1117		48	12	4	Pantalla digital	texto
1118		48	13	4	Pantalla digital	texto
1119		48	14	4	Pantalla digital	texto
1120		48	15	4	Pantalla digital	texto
1122		49	11	4	Interruptor parada de emergencia	texto
1123		49	10	4	Interruptor parada de emergencia	texto
1124		49	9	4	Interruptor parada de emergencia	texto
1125		49	7	4	Interruptor parada de emergencia	texto
1130		49	8	4	Interruptor parada de emergencia	texto
1131		49	12	4	Interruptor parada de emergencia	texto
1132		49	13	4	Interruptor parada de emergencia	texto
1134		49	15	4	Interruptor parada de emergencia	texto
1136		50	11	4	Caballete lateral	texto
1137		50	10	4	Caballete lateral	texto
1138		50	9	4	Caballete lateral	texto
1139		50	7	4	Caballete lateral	texto
1143		50	5	4	Caballete lateral	texto
1145		50	12	4	Caballete lateral	texto
1146		50	13	4	Caballete lateral	texto
1148		50	15	4	Caballete lateral	texto
1150		51	11	4	Estriberas tipo enduro	texto
1151		51	10	4	Estriberas tipo enduro	texto
1073	Si	26	6	4	Defensas laterales	texto
1074	Si	27	6	4	Juego de herramientas	texto
1076	Si	29	6	4	Interruptor de caballete lateral	texto
1084	Si	46	6	4	Indicador de avería del ABS	texto
1098	Si	47	6	4	Indicador check engine	texto
1112	Si	48	6	4	Pantalla digital	texto
1126	Si	49	6	4	Interruptor parada de emergencia	texto
1140	Si	50	6	4	Caballete lateral	texto
1141	Si	50	3	4	Caballete lateral	texto
1357		29	15	4	Pantalla  TFT	texto
1354	Si	5	15	4	Reloj	texto
1355	Si	17	15	4	Conectividad Bluetooth y Navegacion	texto
1356	Si	18	15	4	Luces de emergencia (Hazard)	texto
1133	Si	49	14	4	Interruptor parada de emergencia	texto
1147	Si	50	14	4	Caballete lateral	texto
1152		51	9	4	Estriberas tipo enduro	texto
1153		51	7	4	Estriberas tipo enduro	texto
1155		51	3	4	Estriberas tipo enduro	texto
1271	Pinza Nissin, disco 240mm	7	16	2	Freno trasero	texto
1157		51	5	4	Estriberas tipo enduro	texto
1158		51	8	4	Estriberas tipo enduro	texto
1159		51	12	4	Estriberas tipo enduro	texto
1160		51	13	4	Estriberas tipo enduro	texto
1161		51	14	4	Estriberas tipo enduro	texto
1162		51	15	4	Estriberas tipo enduro	texto
1164		52	11	4	Palanca de freno ajustable	texto
1165		52	10	4	Palanca de freno ajustable	texto
1166		52	9	4	Palanca de freno ajustable	texto
1167		52	7	4	Palanca de freno ajustable	texto
1168		52	6	4	Palanca de freno ajustable	texto
1169		52	3	4	Palanca de freno ajustable	texto
1171		52	5	4	Palanca de freno ajustable	texto
1172		52	8	4	Palanca de freno ajustable	texto
1173		52	12	4	Palanca de freno ajustable	texto
1174		52	13	4	Palanca de freno ajustable	texto
1175		52	14	4	Palanca de freno ajustable	texto
1176		52	15	4	Palanca de freno ajustable	texto
1071	Si	24	6	4	Parrilla trasera	texto
1154	Si	51	6	4	Estriberas tipo enduro	texto
321	Bicilíndrico de 4 tiempos	1	3	1	Tipo	texto
324	68 mm x 44,3 mm	4	3	1	Diametro x carrera	texto
329	Multidisco en baño de aceite	9	3	1	Embrague	texto
334	Horquilla invertida	2	3	2	Suspension delantera	texto
338	Disco simple 298 mm, pinzas de 2 pistones, ABS Bosch	6	3	2	Freno delantero	texto
344	1410 mm	4	3	3	Distancia entre ejes	texto
1178		53	11	4	Medidor de temperatura de motor	texto
1179		53	10	4	Medidor de temperatura de motor	texto
1180		53	9	4	Medidor de temperatura de motor	texto
1181		53	7	4	Medidor de temperatura de motor	texto
1182		53	6	4	Medidor de temperatura de motor	texto
1185		53	5	4	Medidor de temperatura de motor	texto
1186		53	8	4	Medidor de temperatura de motor	texto
1187		53	12	4	Medidor de temperatura de motor	texto
1188		53	13	4	Medidor de temperatura de motor	texto
1189		53	14	4	Medidor de temperatura de motor	texto
1190		53	15	4	Medidor de temperatura de motor	texto
1183	Si	53	3	4	Medidor de temperatura de motor	texto
1402		7	13	4	Indicador de averia del ABS Bosch	texto
1403		8	13	4	Indicador de marcha engranada	texto
1404		9	13	4	Pantalla TFT	texto
1405		10	13	4	Indicador de temperatura alta de motor	texto
1406		11	13	4	Sensor de presion neumaticos	texto
1409		14	13	4	Control crucero	texto
1410		15	13	4	Cubre Punos	texto
1412		17	13	4	Conectividad Bluetooth y Navegacion	texto
1413		18	13	4	Luces de emergencia (Hazard)	texto
1416		21	13	4	Toma 12V, USB y USB-C	texto
1418		23	13	4	TCS Desconectable	texto
1419		24	13	4	Parrilla trasera	texto
1420		25	13	4	Neblineros integrados	texto
1421		26	13	4	Defensas laterales	texto
1423		28	13	4	Faros Auxiliares	texto
1424		29	13	4	Interruptor de caballete lateral	texto
1425		30	13	4	Radar	texto
1426		31	13	4	Anti Shimmy	texto
1427	Si	29	13	4	Pantalla  TFT	texto
1428	Si	34	13	4	Punteras de cambio y freno articuladas	texto
1429	Si	38	13	4	Cubrecárter	texto
1430	Si	39	13	4	Conectividad	texto
1222		1	8	4	Display 100% digital	texto
1223		2	8	4	Cuentakilometros total y parcial	texto
1224		3	8	4	Parabrisas regulable en altura	texto
1225		4	8	4	Medidor de combustible	texto
1226		5	8	4	Reloj	texto
1230		9	8	4	Pantalla TFT	texto
1232		11	8	4	Sensor de presion neumaticos	texto
1467		54	3	4	Indicador de avería del Nissin ABS Bosch	texto
1468		54	5	4	Indicador de avería del Nissin ABS Bosch	texto
1228	Si	7	8	4	Indicador de averia del ABS Bosch	texto
1229	Si	8	8	4	Indicador de marcha engranada	texto
1231	Si	10	8	4	Indicador de temperatura alta de motor	texto
1233	Si	12	8	4	Iluminacion Full LED	texto
1359		38	15	4	Cubrecárter	texto
1360		39	15	4	Conectividad	texto
1407	Si	12	13	4	Iluminacion Full LED	texto
1408	Si	13	13	4	Arranque sin llave	texto
1411	Si	16	13	4	Bluetooth	texto
1414	Si	19	13	4	Calefaccion en asiento	texto
1415	Si	20	13	4	Calefaccion en punos	texto
1417	Si	22	13	4	Camara frontal	texto
1422	Si	27	13	4	Juego de herramientas	texto
1234		13	8	4	Arranque sin llave	texto
1235		14	8	4	Control crucero	texto
1237		16	8	4	Bluetooth	texto
1238		17	8	4	Conectividad Bluetooth y Navegacion	texto
1239		18	8	4	Luces de emergencia (Hazard)	texto
1240		19	8	4	Calefaccion en asiento	texto
1241		20	8	4	Calefaccion en punos	texto
1242		21	8	4	Toma 12V, USB y USB-C	texto
1243		22	8	4	Camara frontal	texto
1244		23	8	4	TCS Desconectable	texto
1246		25	8	4	Neblineros integrados	texto
1247		26	8	4	Defensas laterales	texto
1249		28	8	4	Faros Auxiliares	texto
1250		29	8	4	Interruptor de caballete lateral	texto
1251		30	8	4	Radar	texto
1252		31	8	4	Anti Shimmy	texto
1276	1450 mm	4	16	3	Distancia entre ejes	texto
1361		1	14	4	Display 100% digital	texto
1362		2	14	4	Cuentakilometros total y parcial	texto
1363		3	14	4	Parabrisas regulable en altura	texto
1364		4	14	4	Medidor de combustible	texto
1365		5	14	4	Reloj	texto
1367		7	14	4	Indicador de averia del ABS Bosch	texto
1369		9	14	4	Pantalla TFT	texto
1371		11	14	4	Sensor de presion neumaticos	texto
1373		13	14	4	Arranque sin llave	texto
1374		14	14	4	Control crucero	texto
1375		15	14	4	Cubre Punos	texto
1376		16	14	4	Bluetooth	texto
1377		17	14	4	Conectividad Bluetooth y Navegacion	texto
1378		18	14	4	Luces de emergencia (Hazard)	texto
1379		19	14	4	Calefaccion en asiento	texto
1380		20	14	4	Calefaccion en punos	texto
1381		21	14	4	Toma 12V, USB y USB-C	texto
1382		22	14	4	Camara frontal	texto
1383		23	14	4	TCS Desconectable	texto
1384		24	14	4	Parrilla trasera	texto
1385		25	14	4	Neblineros integrados	texto
1386		26	14	4	Defensas laterales	texto
1388		28	14	4	Faros Auxiliares	texto
1389		29	14	4	Interruptor de caballete lateral	texto
1390		30	14	4	Radar	texto
1391		31	14	4	Anti Shimmy	texto
1392	Si	29	14	4	Pantalla  TFT	texto
1393	Si	34	14	4	Punteras de cambio y freno articuladas	texto
1394	Si	38	14	4	Cubrecárter	texto
1395	Si	39	14	4	Conectividad	texto
1431		1	12	4	Display 100% digital	texto
1432		2	12	4	Cuentakilometros total y parcial	texto
1433		3	12	4	Parabrisas regulable en altura	texto
1434		4	12	4	Medidor de combustible	texto
1437		7	12	4	Indicador de averia del ABS Bosch	texto
1438		8	12	4	Indicador de marcha engranada	texto
1440		10	12	4	Indicador de temperatura alta de motor	texto
1441		11	12	4	Sensor de presion neumaticos	texto
1444		14	12	4	Control crucero	texto
1445		15	12	4	Cubre Punos	texto
1446		16	12	4	Bluetooth	texto
1447		17	12	4	Conectividad Bluetooth y Navegacion	texto
1448		18	12	4	Luces de emergencia (Hazard)	texto
1449		19	12	4	Calefaccion en asiento	texto
1450		20	12	4	Calefaccion en punos	texto
1451		21	12	4	Toma 12V, USB y USB-C	texto
1453		23	12	4	TCS Desconectable	texto
1454		24	12	4	Parrilla trasera	texto
1455		25	12	4	Neblineros integrados	texto
1456		26	12	4	Defensas laterales	texto
1458		28	12	4	Faros Auxiliares	texto
1459		29	12	4	Interruptor de caballete lateral	texto
1460		30	12	4	Radar	texto
1461		31	12	4	Anti Shimmy	texto
1469		54	6	4	Indicador de avería del Nissin ABS Bosch	texto
1470		54	7	4	Indicador de avería del Nissin ABS Bosch	texto
1471		54	8	4	Indicador de avería del Nissin ABS Bosch	texto
1472		54	9	4	Indicador de avería del Nissin ABS Bosch	texto
1482		55	5	4	Balizas	texto
1245	Si	24	8	4	Parrilla trasera	texto
1248	Si	27	8	4	Juego de herramientas	texto
1366	Si	6	14	4	Indicador de averia de Inyeccion	texto
1368	Si	8	14	4	Indicador de marcha engranada	texto
1372	Si	12	14	4	Iluminacion Full LED	texto
1387	Si	27	14	4	Juego de herramientas	texto
1435	Si	5	12	4	Reloj	texto
1436	Si	6	12	4	Indicador de averia de Inyeccion	texto
1439	Si	9	12	4	Pantalla TFT	texto
1442	Si	12	12	4	Iluminacion Full LED	texto
1443	Si	13	12	4	Arranque sin llave	texto
1452	Si	22	12	4	Camara frontal	texto
1457	Si	27	12	4	Juego de herramientas	texto
1462		29	12	4	Pantalla  TFT	texto
1463		34	12	4	Punteras de cambio y freno articuladas	texto
1464		38	12	4	Cubrecárter	texto
1465		39	12	4	Conectividad	texto
1473		54	10	4	Indicador de avería del Nissin ABS Bosch	texto
1474		54	11	4	Indicador de avería del Nissin ABS Bosch	texto
1475		54	12	4	Indicador de avería del Nissin ABS Bosch	texto
1476		54	13	4	Indicador de avería del Nissin ABS Bosch	texto
1477		54	14	4	Indicador de avería del Nissin ABS Bosch	texto
1478		54	15	4	Indicador de avería del Nissin ABS Bosch	texto
1479	Si	54	16	4	Indicador de avería del Nissin ABS Bosch	texto
1483		55	6	4	Balizas	texto
1484		55	7	4	Balizas	texto
1485		55	8	4	Balizas	texto
1486		55	9	4	Balizas	texto
1487		55	10	4	Balizas	texto
1488		55	11	4	Balizas	texto
1489		55	12	4	Balizas	texto
1491		55	14	4	Balizas	texto
1492		55	15	4	Balizas	texto
1495		56	3	4	Indicador de presión de neumáticos	texto
1496		56	5	4	Indicador de presión de neumáticos	texto
1497		56	6	4	Indicador de presión de neumáticos	texto
1498		56	7	4	Indicador de presión de neumáticos	texto
1499		56	8	4	Indicador de presión de neumáticos	texto
1500		56	9	4	Indicador de presión de neumáticos	texto
1501		56	10	4	Indicador de presión de neumáticos	texto
1502		56	11	4	Indicador de presión de neumáticos	texto
1503		56	12	4	Indicador de presión de neumáticos	texto
1504		56	13	4	Indicador de presión de neumáticos	texto
1505		56	14	4	Indicador de presión de neumáticos	texto
1506		56	15	4	Indicador de presión de neumáticos	texto
1297	Si	16	16	4	Bluetooth	texto
1310	Si	29	16	4	Interruptor de caballete lateral	texto
1325		29	16	4	Pantalla  TFT	texto
1326		29	16	4	Control de tracción TCS desconectable	texto
1335		36	16	4	Caballete central	texto
1341	Si	41	16	4	Cuentakilómetros total y parcial digital	texto
1350	Si	50	16	4	Caballete lateral	texto
1353	Si	53	16	4	Medidor de temperatura de motor	texto
1493	Si	55	16	4	Balizas	texto
1507	Si	56	16	4	Indicador de presión de neumáticos	texto
1508	Si	29	9	4	Pantalla  TFT	texto
1509	Si	34	9	4	Punteras de cambio y freno articuladas	texto
1510	Si	38	9	4	Cubrecárter	texto
1511	Si	39	9	4	Conectividad	texto
1515	Si	39	5	4	Conectividad	texto
81	Bicilíndrico se 8 válvulas y doble árbol de levas en cabeza (DOHC)	1	5	1	Tipo	texto
88	58 Nm / 6500 rpm	8	5	1	Par maximo	texto
93	Basculante diseño exclusivo	1	5	2	Chasis	texto
96	Pirelli GT 120/70-17	4	5	2	Neumatico delantero	texto
99	Disco 240 mm con pinza Nissin simple pistón	7	5	2	Freno trasero	texto
1517		57	3	4	Navegación Turn by Turn	texto
1519		57	6	4	Navegación Turn by Turn	texto
1520		57	7	4	Navegación Turn by Turn	texto
1521		57	8	4	Navegación Turn by Turn	texto
1522		57	9	4	Navegación Turn by Turn	texto
1523		57	10	4	Navegación Turn by Turn	texto
1524		57	11	4	Navegación Turn by Turn	texto
1525		57	12	4	Navegación Turn by Turn	texto
1526		57	13	4	Navegación Turn by Turn	texto
1527		57	14	4	Navegación Turn by Turn	texto
1528		57	15	4	Navegación Turn by Turn	texto
1529		57	16	4	Navegación Turn by Turn	texto
1531		58	3	4	Marcha engranada	texto
1533		58	6	4	Marcha engranada	texto
1534		58	7	4	Marcha engranada	texto
1535		58	8	4	Marcha engranada	texto
1536		58	9	4	Marcha engranada	texto
1537		58	10	4	Marcha engranada	texto
1538		58	11	4	Marcha engranada	texto
1539		58	12	4	Marcha engranada	texto
1540		58	13	4	Marcha engranada	texto
1541		58	14	4	Marcha engranada	texto
1542		58	15	4	Marcha engranada	texto
1543		58	16	4	Marcha engranada	texto
1545		59	3	4	Temperatura ambiente	texto
1547		59	6	4	Temperatura ambiente	texto
1548		59	7	4	Temperatura ambiente	texto
1549		59	8	4	Temperatura ambiente	texto
1550		59	9	4	Temperatura ambiente	texto
1551		59	10	4	Temperatura ambiente	texto
1552		59	11	4	Temperatura ambiente	texto
1553		59	12	4	Temperatura ambiente	texto
1554		59	13	4	Temperatura ambiente	texto
1555		59	14	4	Temperatura ambiente	texto
1556		59	15	4	Temperatura ambiente	texto
1557		59	16	4	Temperatura ambiente	texto
1559		60	3	4	Voltaje	texto
1561		60	6	4	Voltaje	texto
1562		60	7	4	Voltaje	texto
1563		60	8	4	Voltaje	texto
1514		38	5	4	Cubrecárter	texto
1518	Si	57	5	4	Navegación Turn by Turn	texto
1532	Si	58	5	4	Marcha engranada	texto
1546	Si	59	5	4	Temperatura ambiente	texto
1560	Si	60	5	4	Voltaje	texto
1490	Si	55	13	4	Balizas	texto
1564		60	9	4	Voltaje	texto
1565		60	10	4	Voltaje	texto
1566		60	11	4	Voltaje	texto
1567		60	12	4	Voltaje	texto
1568		60	13	4	Voltaje	texto
1569		60	14	4	Voltaje	texto
1570		60	15	4	Voltaje	texto
1571		60	16	4	Voltaje	texto
1512		29	5	4	Pantalla  TFT	texto
1513		34	5	4	Punteras de cambio y freno articuladas	texto
1576		29	3	4	Pantalla  TFT	texto
1577		34	3	4	Punteras de cambio y freno articuladas	texto
1578		38	3	4	Cubrecárter	texto
1579		39	3	4	Conectividad	texto
1580		29	6	4	Pantalla  TFT	texto
1581		34	6	4	Punteras de cambio y freno articuladas	texto
1582		38	6	4	Cubrecárter	texto
1583		39	6	4	Conectividad	texto
481	Monocilíndrico de 4 tiempos (DOHC)	1	8	1	Tipo	texto
484	78 mm x 61,2 mm	4	8	1	Diametro x carrera	texto
491	3,1L/100KM	11	8	1	Consumo homologado	texto
495	Suspensión simple con basculante de estilo único	3	8	2	Suspension trasera	texto
501	2035 mm	1	8	3	Largo	texto
507	155 kg	7	8	3	Peso neto	texto
1585		61	3	4	Asiento calefactable	texto
1586		61	5	4	Asiento calefactable	texto
1587		61	6	4	Asiento calefactable	texto
1588		61	7	4	Asiento calefactable	texto
1590		61	9	4	Asiento calefactable	texto
1591		61	10	4	Asiento calefactable	texto
1592		61	11	4	Asiento calefactable	texto
1593		61	12	4	Asiento calefactable	texto
1594		61	13	4	Asiento calefactable	texto
1595		61	14	4	Asiento calefactable	texto
1596		61	15	4	Asiento calefactable	texto
1597		61	16	4	Asiento calefactable	texto
1599		62	3	4	Puños calefactables	texto
1600		62	5	4	Puños calefactables	texto
1601		62	6	4	Puños calefactables	texto
1602		62	7	4	Puños calefactables	texto
1604		62	9	4	Puños calefactables	texto
1605		62	10	4	Puños calefactables	texto
1606		62	11	4	Puños calefactables	texto
1607		62	12	4	Puños calefactables	texto
1608		62	13	4	Puños calefactables	texto
1609		62	14	4	Puños calefactables	texto
1610		62	15	4	Puños calefactables	texto
1611		62	16	4	Puños calefactables	texto
1613		63	3	4	Intermitentes de emergencia	texto
1614		63	5	4	Intermitentes de emergencia	texto
1615		63	6	4	Intermitentes de emergencia	texto
1616		63	7	4	Intermitentes de emergencia	texto
1618		63	9	4	Intermitentes de emergencia	texto
1619		63	10	4	Intermitentes de emergencia	texto
1620		63	11	4	Intermitentes de emergencia	texto
1621		63	12	4	Intermitentes de emergencia	texto
1622		63	13	4	Intermitentes de emergencia	texto
1623		63	14	4	Intermitentes de emergencia	texto
1624		63	15	4	Intermitentes de emergencia	texto
1625		63	16	4	Intermitentes de emergencia	texto
515	Si	6	8	4	Toma USB	texto
1227	Si	6	8	4	Indicador de averia de Inyeccion	texto
1236	Si	15	8	4	Cubre Punos	texto
1572		29	8	4	Pantalla  TFT	texto
1573		34	8	4	Punteras de cambio y freno articuladas	texto
1574		38	8	4	Cubrecárter	texto
1575		39	8	4	Conectividad	texto
1144	Si	50	8	4	Caballete lateral	texto
1589	Si	61	8	4	Asiento calefactable	texto
1603	Si	62	8	4	Puños calefactables	texto
1617	Si	63	8	4	Intermitentes de emergencia	texto
1626		29	7	4	Pantalla  TFT	texto
1627		34	7	4	Punteras de cambio y freno articuladas	texto
1628		38	7	4	Cubrecárter	texto
1629		39	7	4	Conectividad	texto
1358		34	15	4	Punteras de cambio y freno articuladas	texto
281	Bicilíndrico en V, con 8 válvulas y un solo árbol de levas en la cabeza (SOHC)	1	14	1	Tipo	texto
282	Líquida	2	14	1	Refrigeracion	texto
286	12:01	6	14	1	Relacion de compresion	texto
290	6 velocidades	10	14	1	Cambio	texto
294	Horquilla invertida	2	14	2	Suspension delantera	texto
297	Helios 10/80-15	5	14	2	Neumatico trasero	texto
303	1090 mm	3	14	3	Alto	texto
309	128 km/h	9	14	3	Velocidad maxima	texto
1370	Si	10	14	4	Indicador de temperatura alta de motor	texto
928	Si	41	14	4	Cuentakilómetros total y parcial digital	texto
244	72 mm x 60 mm	4	13	1	Diametro x carrera	texto
249	Seco	9	13	1	Embrague	texto
254	Tubo de horquilla de 35 mm de diámetro con recorrido de 94,5 mm	2	13	2	Suspension delantera	texto
257	Helios 140/60-13	5	13	2	Neumatico trasero	texto
260	ABS de doble canal con control de tracción TCS	8	13	2	ABS	texto
269	125km/h	9	13	3	Velocidad maxima	texto
1631		64	3	4	Indicador de avería de ABS	texto
1632		64	5	4	Indicador de avería de ABS	texto
1633		64	6	4	Indicador de avería de ABS	texto
1634		64	7	4	Indicador de avería de ABS	texto
1635		64	8	4	Indicador de avería de ABS	texto
1636		64	9	4	Indicador de avería de ABS	texto
1637		64	10	4	Indicador de avería de ABS	texto
1638		64	11	4	Indicador de avería de ABS	texto
1641		64	14	4	Indicador de avería de ABS	texto
1642		64	15	4	Indicador de avería de ABS	texto
1643		64	16	4	Indicador de avería de ABS	texto
1645		65	3	4	Testigo alarma presión neumáticos	texto
1646		65	5	4	Testigo alarma presión neumáticos	texto
1647		65	6	4	Testigo alarma presión neumáticos	texto
1648		65	7	4	Testigo alarma presión neumáticos	texto
1649		65	8	4	Testigo alarma presión neumáticos	texto
1650		65	9	4	Testigo alarma presión neumáticos	texto
1651		65	10	4	Testigo alarma presión neumáticos	texto
1652		65	11	4	Testigo alarma presión neumáticos	texto
1653		65	12	4	Testigo alarma presión neumáticos	texto
1655		65	14	4	Testigo alarma presión neumáticos	texto
1656		65	15	4	Testigo alarma presión neumáticos	texto
1657		65	16	4	Testigo alarma presión neumáticos	texto
1659		66	3	4	Indicador de alta temperatura de motor	texto
1660		66	5	4	Indicador de alta temperatura de motor	texto
1661		66	6	4	Indicador de alta temperatura de motor	texto
1662		66	7	4	Indicador de alta temperatura de motor	texto
1663		66	8	4	Indicador de alta temperatura de motor	texto
1664		66	9	4	Indicador de alta temperatura de motor	texto
1665		66	10	4	Indicador de alta temperatura de motor	texto
1666		66	11	4	Indicador de alta temperatura de motor	texto
1669		66	14	4	Indicador de alta temperatura de motor	texto
1670		66	15	4	Indicador de alta temperatura de motor	texto
1671		66	16	4	Indicador de alta temperatura de motor	texto
1673		67	3	4	Parabrisas regulable manual	texto
1674		67	5	4	Parabrisas regulable manual	texto
1675		67	6	4	Parabrisas regulable manual	texto
1676		67	7	4	Parabrisas regulable manual	texto
1677		67	8	4	Parabrisas regulable manual	texto
1678		67	9	4	Parabrisas regulable manual	texto
1679		67	10	4	Parabrisas regulable manual	texto
1680		67	11	4	Parabrisas regulable manual	texto
1681		67	12	4	Parabrisas regulable manual	texto
1683		67	14	4	Parabrisas regulable manual	texto
1684		67	15	4	Parabrisas regulable manual	texto
1685		67	16	4	Parabrisas regulable manual	texto
1401	Si	6	13	4	Indicador de averia de Inyeccion	texto
1640	Si	64	13	4	Indicador de avería de ABS	texto
1654	Si	65	13	4	Testigo alarma presión neumáticos	texto
1668	Si	66	13	4	Indicador de alta temperatura de motor	texto
1682	Si	67	13	4	Parabrisas regulable manual	texto
201	Monociíndrico de 4 tiempos	1	12	1	Tipo	texto
206	10,6:1	6	12	1	Relacion de compresion	texto
211	2,3 L / 100 KM	11	12	1	Consumo homologado	texto
214	Tubo de horquilla 31 mm de diámetro con recorrido de 93 mm	2	12	2	Suspension delantera	texto
219	Disco simple	7	12	2	Freno trasero	texto
225	140 mm	5	12	3	Distancia al suelo	texto
1639	Si	64	12	4	Indicador de avería de ABS	texto
1667	Si	66	12	4	Indicador de alta temperatura de motor	texto
1690		34	11	4	Punteras de cambio y freno articuladas	texto
1691		38	11	4	Cubrecárter	texto
1692		39	11	4	Conectividad	texto
1694	Líquida	2	17	1	Refrigeracion	texto
1695	EFI inyección electrónica	3	17	1	Alimentacion	texto
1697	662,8 cc	5	17	1	Cilindrada	texto
1698	11,8:1	6	17	1	Relacion de compresion	texto
1699	99 HP (74 kW) / 11500 rpm	7	17	1	Potencia Maxima	texto
1700	64 Nm / 10000 rpm	8	17	1	Par maximo	texto
1701	Tipo antirrebote	9	17	1	Embrague	texto
1703	5,5L/100km	11	17	1	Consumo homologado	texto
1704	12V 10AH	12	17	1	Bateria	texto
1705	Perimetral de acero	1	17	2	Chasis	texto
1707	Monoamortiguador central	3	17	2	Suspension trasera	texto
1708	120/70 ZR17	4	17	2	Neumatico delantero	texto
1722		1	17	4	Display 100% digital	texto
1723		2	17	4	Cuentakilometros total y parcial	texto
1724		3	17	4	Parabrisas regulable en altura	texto
1725		4	17	4	Medidor de combustible	texto
1726		5	17	4	Reloj	texto
1727		6	17	4	Indicador de averia de Inyeccion	texto
1728		7	17	4	Indicador de averia del ABS Bosch	texto
1729		8	17	4	Indicador de marcha engranada	texto
1730		9	17	4	Pantalla TFT	texto
1731		10	17	4	Indicador de temperatura alta de motor	texto
1732		11	17	4	Sensor de presion neumaticos	texto
1733		12	17	4	Iluminacion Full LED	texto
1734		13	17	4	Arranque sin llave	texto
1735		14	17	4	Control crucero	texto
1736		15	17	4	Cubre Punos	texto
1737		16	17	4	Bluetooth	texto
1738		17	17	4	Conectividad Bluetooth y Navegacion	texto
1739		18	17	4	Luces de emergencia (Hazard)	texto
1740		19	17	4	Calefaccion en asiento	texto
1741		20	17	4	Calefaccion en punos	texto
1742		21	17	4	Toma 12V, USB y USB-C	texto
1743		22	17	4	Camara frontal	texto
1744		23	17	4	TCS Desconectable	texto
1745		24	17	4	Parrilla trasera	texto
1746		25	17	4	Neblineros integrados	texto
1747		26	17	4	Defensas laterales	texto
1748		27	17	4	Juego de herramientas	texto
1749		28	17	4	Faros Auxiliares	texto
1750		29	17	4	Interruptor de caballete lateral	texto
1751		30	17	4	Radar	texto
1752		31	17	4	Anti Shimmy	texto
1764		29	17	4	Pantalla  TFT	texto
1765		29	17	4	Control de tracción TCS desconectable	texto
1766		29	17	4	Alumbrado Full Led	texto
1767		30	17	4	Alerta de frenada de emergencia ESS	texto
1768		32	17	4	Paramanos	texto
1769		33	17	4	Llantas tubeless de radios cruzados	texto
1770		34	17	4	Punteras de cambio y freno articuladas	texto
1771		34	17	4	Parabrisas regulable	texto
1772		35	17	4	Cámara frontal HD	texto
1773		35	17	4	Manetas regulables	texto
1774		36	17	4	Caballete central	texto
1775		36	17	4	Toma USB y 12V	texto
1776		37	17	4	Defensas	texto
1777		38	17	4	Cubrecárter	texto
1778		39	17	4	Conectividad	texto
1779		40	17	4	Velocímetro digital	texto
1780		41	17	4	Cuentakilómetros total y parcial digital	texto
1781		42	17	4	Cuenta revoluciones digital	texto
1782		43	17	4	Medidor de combustible digital	texto
1783		44	17	4	Indicador de avería de ABS Bosch	texto
1784		45	17	4	Luz de sobrepaso	texto
1785		46	17	4	Indicador de avería del ABS	texto
1786		47	17	4	Indicador check engine	texto
1787		48	17	4	Pantalla digital	texto
1788		49	17	4	Interruptor parada de emergencia	texto
1789		50	17	4	Caballete lateral	texto
1790		51	17	4	Estriberas tipo enduro	texto
1791		52	17	4	Palanca de freno ajustable	texto
1792		53	17	4	Medidor de temperatura de motor	texto
1793		54	17	4	Indicador de avería del Nissin ABS Bosch	texto
1794		55	17	4	Balizas	texto
1795		56	17	4	Indicador de presión de neumáticos	texto
1796		57	17	4	Navegación Turn by Turn	texto
1797		58	17	4	Marcha engranada	texto
1710	Doble disco, pinza fija de cuatro pistones, diámetro de disco de 298 mm.	6	17	2	Freno delantero	texto
1712	Doble vía	8	17	2	ABS	texto
1713	2090 mm	1	17	3	Largo	texto
1714	950 mm	2	17	3	Ancho	texto
1715	1210 mm	3	17	3	Alto	texto
1716	1450 mm	4	17	3	Distancia entre ejes	texto
1717	130 mm	5	17	3	Distancia al suelo	texto
1719	215 kg	7	17	3	Peso neto	texto
1720	15,5 L	8	17	3	Capacidad deposito	texto
1721	235 km/h	9	17	3	Velocidad maxima	texto
1755	Si	1	17	4	Iluminacion LED	texto
1756	Si	2	17	4	Instrumentacion TFT a color	texto
1757	Si	3	17	4	Sistema de frenos Brembo y Nissin	texto
1758	Si	4	17	4	Sistema de control de traccion	texto
1759	Si	6	17	4	Toma USB	texto
1760	Si	7	17	4	Dos modos de conduccion	texto
1761	Si	8	17	4	Computadora de viaje	texto
1762	Si	9	17	4	Launch control	texto
1753	Si	32	17	4	Sistema Quick Shift	texto
1754	Brembo / Nissin	33	17	4	Frenos	texto
1798		59	17	4	Temperatura ambiente	texto
1799		60	17	4	Voltaje	texto
1800		61	17	4	Asiento calefactable	texto
1801		62	17	4	Puños calefactables	texto
1802		63	17	4	Intermitentes de emergencia	texto
1803		64	17	4	Indicador de avería de ABS	texto
1804		65	17	4	Testigo alarma presión neumáticos	texto
1805		66	17	4	Indicador de alta temperatura de motor	texto
1806		67	17	4	Parabrisas regulable manual	texto
1693	Motor de 4 cilindros en línea, 16 válvulas y doble árbol de levas (DOHC)	1	17	1	Tipo	texto
1696	67 mm x 47 mm	4	17	1	Diametro x carrera	texto
1702	6 velocidades	10	17	1	Cambio	texto
1706	Horquilla invertida KYB de 43 mm	2	17	2	Suspension delantera	texto
1709	180/55 ZR17	5	17	2	Neumatico trasero	texto
1711	Disco de 240 mm con pinza Nissin de 1 pistón.	7	17	2	Freno trasero	texto
1718	800 mm Ajustable	6	17	3	Altura asiento	texto
1763	Si	10	17	4	Accionamiento valvula de salida de escape	texto
\.


--
-- Data for Name: productos_compatibilidadproductomoto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos_compatibilidadproductomoto (id, moto_id, producto_id) FROM stdin;
\.


--
-- Data for Name: productos_especificacionproducto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos_especificacionproducto (id, clave, valor, producto_id) FROM stdin;
\.


--
-- Data for Name: productos_imagenproducto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos_imagenproducto (id, imagen, texto_alternativo, orden, producto_id) FROM stdin;
5	productos/galeria/X_hro-506-sp-solid-purple-13494.png		1	42
6	productos/galeria/X_hro-506-sp-solid-bco-18248.png		1	43
7	productos/galeria/X_preventa-oxs6junio193426.jpg		1	44
8	productos/galeria/X_img-20715860.png		1	45
9	productos/galeria/X_bp0a0114-photoroom7789.jpg		1	46
10	productos/galeria/X_casco-moto-ich-501sp-camaleon-gris-12964.jpg		1	47
11	productos/galeria/X_casco-moto-ich-503-duko-mate-fc-sm-49451.jpg		1	48
12	productos/galeria/X_bp0a0361-photoroom1309.jpg		1	49
13	productos/galeria/X_0006-sh-526sp-evo-cozku-bl-perl-fc-lat8127.jpg		1	50
14	productos/galeria/X_shaft-502sp-solid-ng-gold-59655.jpg		1	51
15	productos/galeria/X_shaft-502sp-solid-nardo-gray-23099.jpg		1	52
16	productos/galeria/X_shaft-502sp-solid-ng-ama-17172.png		1	53
17	productos/galeria/X_0003-sh-598-gtr-jbond-gr-m-rj-lat9653.jpg		1	54
18	productos/galeria/X_casco-shaft-526sp-solid-morado-brillo-4oxs7453.jpg		1	55
19	productos/galeria/X_0002-sh-560-evo-wuoki-gr-os-am-lat8000.jpg		1	56
20	productos/galeria/X_177891-shpro-606sp-solid-bg-bl-lat0816.png		1	57
21	productos/galeria/X_0007-sh-526sp-evo-master-of-sea-az-os-gr-lat4242.jpg		1	58
23	productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp		1	3
24	productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp		1	2
\.


--
-- Data for Name: productos_producto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos_producto (id, nombre, slug, descripcion, precio, imagen_principal, es_destacado, activo, requiere_compatibilidad, fecha_creacion, marca_id, subcategoria_id, orden_carrusel) FROM stdin;
8	Casco AIROH Matryx Rocket Rosado Mate	casco-airoh-matryx-rocket-rosado-mate	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Connor_Achieve_Rosado_1.webp	f	t	f	2026-03-17 02:11:54.268378+00	2	16	1
12	Casco AIROH Matryx Scope Amarillo Mate	casco-airoh-matryx-scope-amarillo-mate	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_Scope_amarillo_1.webp	f	t	f	2026-03-17 02:17:10.647826+00	2	16	1
7	Casco AIROH Matryx Negro Mate	casco-airoh-matryx-negro-mate	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Negro_Mate_1.webp	f	t	f	2026-03-17 02:11:06.795421+00	2	16	1
10	Casco AIROH Commander 2 Carbono Brillo	casco-airoh-commander-2-carbono-brillo	Casco de estilo Trail con calota fabricada en full carbono 6K de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	699990.00	productos/Airoh_Commander_carbono_1.webp	f	t	f	2026-03-17 02:14:11.754564+00	2	16	1
9	Casco AIROH Commander 2 Negro Mate	casco-airoh-commander-2-negro-mate	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/Casco_Airoh_Commander_2_Negro_Mate.webp	f	t	f	2026-03-17 02:13:30.362328+00	2	16	1
5	Casco AIROH Matryx Rocket Azul/Rojo Brillo	casco-airoh-matryx-rocket-azul-rojo-brillo	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_rojo_azul_brillo_1.webp	f	t	f	2026-03-17 02:09:28.844195+00	2	16	1
6	Casco De Moto AIROH Specktre Blanco Brillo	casco-de-moto-airoh-specktre-blanco-brillo	Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.	319990.00	productos/Airoh_Specktre_blanco_1.webp	f	t	f	2026-03-17 02:10:24.698881+00	2	16	1
11	Casco AIROH Spark 2 Negro Mate	casco-airoh-spark-2-negro-mate	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Negro_mate_2.webp	f	t	f	2026-03-17 02:14:51.348918+00	2	16	1
14	Casco Airoh Connor Omega Mate	casco-airoh-connor-omega-mate	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_Omega_1.webp	f	t	f	2026-03-17 02:18:42.488074+00	2	16	1
3	Casco AIROH Commander 2 Reveal Militar Verde Mate	casco-airoh-commander-2-reveal-militar-verde-mate	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/galeria/Casco_Airoh_Commander_2_Reveal_military_verde_Mate.webp	f	t	f	2026-03-17 00:03:58.134604+00	2	16	1
16	Casco Airoh Connor Achieve Naranjo Mate	casco-airoh-connor-achieve-naranjo-mate	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_Achieve_naranjo_1.webp	f	t	f	2026-03-17 02:21:50.346368+00	2	16	1
17	Casco Airoh Connor Negro Mate	casco-airoh-connor-negro-mate	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_Negro__mate_1.webp	f	t	f	2026-03-17 02:22:17.475368+00	2	16	1
18	Casco Airoh Connor Achieve Rosado Mate	casco-airoh-connor-achieve-rosado-mate	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_Achieve_Rosado_1_d58lEDC.webp	f	t	f	2026-03-17 02:22:47.233007+00	2	16	1
23	Casco Para Moto AIROH Bandit Negro Mate	casco-para-moto-airoh-bandit-negro-mate	El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.	349990.00	productos/Bandit_Negro_Mate_1.webp	f	t	f	2026-03-17 02:25:58.903341+00	2	16	1
24	Casco Para Moto AIROH Bandit Spicy Gris Brillo	casco-para-moto-airoh-bandit-spicy-gris-brillo	El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.	349990.00	productos/Bandit_Spicy_Gris_1_0490dbb8-c134-4608-9c03-6508a6771689.webp	f	t	f	2026-03-17 02:27:08.229631+00	2	16	1
19	Casco AIROH Matryx Rocket Naranjo Mate	casco-airoh-matryx-rocket-naranjo-mate	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_Orange_1.webp	f	t	f	2026-03-17 02:23:16.41071+00	2	16	1
20	Casco AIROH Commander 2 Reveal Azul Brillo	casco-airoh-commander-2-reveal-azul-brillo	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo.webp	f	t	f	2026-03-17 02:23:46.601048+00	2	16	1
22	Casco AIROH Commander 2 Mavick Naranjo Mate	casco-airoh-commander-2-mavick-naranjo-mate	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/Casco_Airoh_Commander_2_Mavick_Naranjo_Mate.webp	f	t	f	2026-03-17 02:24:48.039587+00	2	16	1
13	Casco AIROH Spark 2 Zenith Rosado Mate	casco-airoh-spark-2-zenith-rosado-mate	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_zenith_Rosado_mate_1.webp	f	t	f	2026-03-17 02:18:06.392748+00	2	16	1
15	Casco AIROH Spark 2 Dart Azul/Rojo	casco-airoh-spark-2-dart-azul-rojo	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Dart_azul_rojo_1.webp	f	t	f	2026-03-17 02:19:11.814662+00	2	16	1
27	Casco Airoh Connor Achieve Azul Brillo	casco-airoh-connor-achieve-azul-brillo	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_Achieve_azul_1.webp	f	t	f	2026-03-17 02:28:32.393893+00	2	16	1
31	Casco AIROH Bandit Tune Azul Rojo Brillo	casco-airoh-bandit-tune-azul-rojo-brillo	El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.	349990.00	productos/Airoh_Bandit_Tune_Azul_Rojo_1.webp	f	t	f	2026-03-17 02:30:47.974648+00	2	16	1
36	Casco AIROH Bandit Spicy Rojo Brillo	casco-airoh-bandit-spicy-rojo-brillo	El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.	349990.00	productos/Bandit_Spicy_Rojo_1_67dc0664-6f81-4a44-b18a-0c5a941b8664.webp	f	t	f	2026-03-17 02:33:20.217879+00	2	16	1
25	Casco AIROH Matryx Scope Light Azul/Rojo Brillo	casco-airoh-matryx-scope-light-azul-rojo-brillo	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_Scope_light_azul_rojo_1.webp	f	t	f	2026-03-17 02:27:40.417691+00	2	16	1
32	Casco De Moto AIROH Specktre Negro Mate	casco-de-moto-airoh-specktre-negro-mate	Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready,	319990.00	productos/Airoh_Specktre_negro_1.webp	f	t	f	2026-03-17 02:31:23.469758+00	2	16	1
35	Casco De Moto AIROH Specktre Cement Gris Brillo	casco-de-moto-airoh-specktre-cement-gris-brillo	Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.	319990.00	productos/Airoh_Specktre_cement_grey_1.webp	f	t	f	2026-03-17 02:32:42.944653+00	2	16	1
26	Casco AIROH Spark 2 Cement Gris Brillo	casco-airoh-spark-2-cement-gris-brillo	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Cement_1.webp	f	t	f	2026-03-17 02:28:04.914738+00	2	16	1
29	Casco AIROH Spark 2 Dart Amarillo Brillo	casco-airoh-spark-2-dart-amarillo-brillo	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Dart_Amarillo_1.webp	f	t	f	2026-03-17 02:29:31.05037+00	2	16	1
30	Casco AIROH Spark 2 Dart Rojo Brillo	casco-airoh-spark-2-dart-rojo-brillo	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Dart_rojo_1.webp	f	t	f	2026-03-17 02:30:07.919499+00	2	16	1
34	Casco AIROH Spark 2 Chrono Naranjo Brillo	casco-airoh-spark-2-chrono-naranjo-brillo	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Chrono_naranjo_1.webp	f	t	f	2026-03-17 02:32:17.875932+00	2	16	1
33	Casco Airoh Connor Cement Gris Brillo	casco-airoh-connor-cement-gris-brillo	Casco con calota fabricada de resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Tiene una amplia pantalla que se puede desmontar sin necesidad de herramientas y que es resistente a los arañazos y rayos UV. El sistema de ventilación se compone de dos entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico.	179990.00	productos/Airoh_Connor_cement_gris_1.webp	f	t	f	2026-03-17 02:31:53.056254+00	2	16	1
43	Casco Moto HRO 506 Solid Bco Integral Norma Dot	casco-moto-hro-506-solid-bco-integral-norma-dot	El HRO 506 es un casco integral diseñado para ofrecer máxima protección, ligereza y comodidad en tus recorridos diarios o de larga distancia. Su construcción en materiales de alta resistencia, combinada con un diseño aerodinámico moderno, lo convierte en una excelente opción para quienes buscan rendimiento y seguridad en un casco integral.	61990.00	productos/X_hro-506-sp-solid-bco-18248.png	f	t	f	2026-03-24 18:28:32.741542+00	8	16	1
38	Casco AIROH Bandit Horn Blanco Brillo	casco-airoh-bandit-horn-blanco-brillo	El Casco Airoh Bandit es la elección definitiva para el motociclista que no se conforma con lo convencional. Inspirado en el diseño clásico pero fabricado con tecnología del futuro, este casco tipo Open Face redefine lo que significa rodar con estilo por la ciudad.	349990.00	productos/Bandit_Horn_Blanco_1.webp	f	t	f	2026-03-17 02:34:21.342954+00	2	16	1
37	Casco De Moto AIROH Specktre Groove Gris Brillo	casco-de-moto-airoh-specktre-groove-gris-brillo	Diseño atractivo con gráficos coloridos, estilo y funcionalidad se unen para dar vida a un casco 2 en 1 capaz de adecuarse a cualquier contexto, desde el commuting urbano hasta el moto turismo más aventurero. Su amplia pantalla principal regala una visibilidad que te permitirá captar cada detalle a tu alrededor, y el equipamiento técnico es de primera clase: doble homologación P/J, que permite el uso tanto cerrado como abierto, calota externa de HRT (High Resistant Thermoplastic), Sun Visor integrado, Communication System Ready, cierre micrométrico, Pinlock® 70 y Stop Wind.	319990.00	productos/Airoh_Specktre_Groove_gris_brillo.webp	f	t	f	2026-03-17 02:33:48.594116+00	2	16	1
42	Casco Moto HRO 506 Solid Purple Integral Norma Dot	casco-moto-hro-506-solid-purple-integral-norma-dot	El HRO 506 es un casco integral diseñado para ofrecer máxima protección, ligereza y comodidad en tus recorridos diarios o de larga distancia. Su construcción en materiales de alta resistencia, combinada con un diseño aerodinámico moderno, lo convierte en una excelente opción para quienes buscan rendimiento y seguridad en un casco integral.	61990.00	productos/X_hro-506-sp-solid-purple-13494.png	f	t	f	2026-03-24 18:27:30.508819+00	8	16	1
44	Casco Moto HRO 3480dv Solid Mr Brillo Abatible Con Sun Visor Dot	casco-moto-hro-3480dv-solid-mr-brillo-abatible-con	Casco abatible HRO fabricado en ABS de alta resistencia, diseñado para brindar seguridad, confort y practicidad en la conducción diaria. Incorpora mecanismo abatible con bloqueo de mentonera, visor exterior con protección UV y anti-rayaduras, además de visor interior polarizado abatible.\r\n\r\nCuenta con interior desmontable, lavable y antibacterial en microfibra, sistema de ventilación frontal y posterior, spoiler aerodinámico y cubre barbilla que reduce el ingreso de viento.\r\n\r\nIncluye cierre micrométrico ajustable, detalles reflectantes para mayor visibilidad nocturna y certificación DOT (FMVSS 218), acreditado por el Ministerio de Transportes de Chile.	69990.00	productos/X_preventa-oxs6junio193426.jpg	f	t	f	2026-03-24 18:30:12.309754+00	8	16	1
45	Casco Moto ICH 3120 Solid Blanco Abatible Con Sun Visor Certificación Dot 3cv	casco-moto-ich-3120-solid-blanco-abatible-con-sun	El Casco Abatible ICH 3120 está diseñado para motociclistas que buscan seguridad certificada, comodidad superior y funcionalidad diaria. Su sistema abatible lo convierte en una opción versátil tanto para uso urbano como para viajes largos, ofreciendo protección confiable sin sacrificar practicidad ni estilo.	54990.00	productos/X_img-20715860.png	f	t	f	2026-03-24 18:33:05.573377+00	9	16	1
46	Casco Moto ICH 503 Neza Az Sm Integral Certificación Dot Qr	casco-moto-ich-503-neza-az-sm-integral-certificaci	Casco integral ICH fabricado en ABS de alta resistencia, diseñado para ofrecer seguridad, comodidad y un estilo aerodinámico gracias a su spoiler renovado. Incorpora visor externo de policarbonato con protección UV y tratamiento anti-rayaduras, además de sistema de ventilación frontal y posterior que mejora la circulación del aire.\r\n\r\nSu interior está confeccionado en EPS de alta densidad, con esponjas laterales removibles, lavables y antibacterial en microfibra, proporcionando mayor confort en cada trayecto. Incluye mentonera textil, cierre micrométrico ajustable y certificación Norma DOT (FMVSS Nº 218), homologado bajo Resolución 1080 (Colombia).	58990.00	productos/X_bp0a0114-photoroom7789.jpg	f	t	f	2026-03-24 18:34:30.955531+00	9	16	1
47	Casco Moto ICH 501sp Camaleon Gris Integral Certificación Dot Qr	casco-moto-ich-501sp-camaleon-gris-integral-certif	El Casco Integral ICH 501SP está diseñado para quienes buscan máxima seguridad y confort en cada trayecto. Fabricado con materiales de alta resistencia y homologaciones internacionales, es la opción ideal para motociclistas que exigen confianza y rendimiento en su equipo de protección.	49990.00	productos/X_casco-moto-ich-501sp-camaleon-gris-12964.jpg	f	t	f	2026-03-24 19:49:56.194556+00	9	16	1
39	Casco AIROH Spark 2 Dart Militar Verde Mate	casco-airoh-spark-2-dart-militar-verde-mate	Casco integral con aspecto deportivo, su calota está fabricada en resina termoplástica HRT (High Resistant Thermoplastic) de alta resistencia y ligereza. Amplia pantalla resistente a los arañazos y rayos UV con predisposición para Pinlock®. Incorpora la tecnología ASN (Airoh Sliding Net) y el sistema ATVR (Airoh Tool-less Visor Removal) para poderla desmontar fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera. Cierre micrométrico. ECE22.06	269990.00	productos/Airoh_Spark_2_Dart_verde_militar_1.webp	f	t	f	2026-03-17 02:34:52.605939+00	2	16	1
50	CASCO MOTO SHAFT 526SP EVO COZKU INTEGRAL	casco-moto-shaft-526sp-evo-cozku-bl-pr-fc-integral	Casco integral Shaft modelo SH-526SP EVO, fabricado con carcaza de ABS de alta resistencia, diseñado para ofrecer seguridad, confort y un ajuste óptimo en cada trayecto. Incorpora interior con tecnología SAT de absorción de impactos, tapizado de lujo personalizado en tela 100% poliéster antibacterial, además de cubre barbilla textil que reduce el ingreso de viento.\r\n\r\nCuenta con visor de policarbonato con protección UV y tratamiento anti-rayaduras, sistema de ventilaciones frontales y superiores regulables con salidas posteriores fijas que favorecen la evacuación del aire. Incluye cierre micrométrico ajustable, estructura de una sola coraza para todas las tallas, está preparado para intercomunicador y es compatible con Pinlock 30 (no incluido).	119990.00	productos/X_0006-sh-526sp-evo-cozku-bl-perl-fc-lat8127.jpg	f	t	f	2026-03-24 21:28:53.738202+00	3	16	1
51	Casco Moto SHAFT 502sp Solid Ng Gold Integral Normal Dot Acreditado	casco-moto-shaft-502sp-solid-ng-gold-integral-norm	El casco integral Shaft 502 combina protección, comodidad y diseño moderno, siendo una excelente opción para conducción urbana y en carretera. Su carcaza de ABS de alta resistencia junto con el interior con tecnología SAT de absorción de impactos brindan mayor seguridad en cada trayecto.\r\n\r\nCuenta con interior en EPS de alta densidad, desmontable, lavable y antibacterial en microfibra de poliéster, además de cubre barbilla textil que ayuda a reducir el ingreso de viento. Incorpora visor de policarbonato con protección UV y tratamiento anti-rayaduras, preparado para Pinlock®, y sistema de ventilación optimizada con entradas frontales y salidas posteriores.\r\n\r\nIncluye cierre micrométrico ajustable, está preparado para intercomunicador y posee certificación internacional DOT con homologación Conaset mediante código QR para uso en Chile.	69990.00	productos/X_shaft-502sp-solid-ng-gold-59655.jpg	f	t	f	2026-03-24 21:31:53.783678+00	3	16	1
52	Casco Moto SHAFT 502sp Solid Nardo Gray Integral Normal Dot Acreditado	casco-moto-shaft-502sp-solid-nardo-gray-integral-n	El casco integral Shaft 502 ofrece una combinación ideal de protección, confort y diseño moderno, pensado para brindar seguridad tanto en trayectos urbanos como en carretera. Su carcaza de ABS de alta resistencia junto con el interior con tecnología SAT de absorción de impactos proporcionan mayor protección en cada recorrido.\r\n\r\nCuenta con interior en EPS de alta densidad, desmontable, lavable y antibacterial en microfibra de poliéster, además de cubre barbilla textil que ayuda a reducir el ingreso de viento. Incorpora visor de policarbonato con protección UV y tratamiento anti-rayaduras, preparado para Pinlock®, y un eficiente sistema de ventilación con entradas frontales y salidas posteriores que favorece la circulación del aire.\r\n\r\nIncluye cierre micrométrico ajustable, está preparado para intercomunicador y posee certificación internacional Norma DOT, con homologación Conaset mediante código QR para uso en Chile.	69990.00	productos/X_shaft-502sp-solid-nardo-gray-23099.jpg	f	t	f	2026-03-24 21:32:55.304186+00	3	16	1
54	Casco Moto SHAFT Sh-598 GTR JBOND GR RJ Integral Sun Visor	casco-moto-shaft-sh-598-gtr-jbond-gr-rj-integral-s	El Shaft SH-598GTR es un casco integral diseñado para ofrecer máxima seguridad, confort y estilo en cada trayecto. Su construcción en ABS de alta resistencia, combinada con un diseño moderno y un completo sistema de ventilación, lo convierten en el aliado perfecto para todo motociclista que busca confianza en la ruta.	124990.00	productos/X_0003-sh-598-gtr-jbond-gr-m-rj-lat9653.jpg	f	t	f	2026-03-24 21:35:03.979589+00	3	16	1
48	Casco Moto ICH 503 Duko Mate Fc Sm Integral Certificación Dot Qr	casco-moto-ich-503-duko-mate-fc-sm-integral-certif	El Casco Integral ICH 503 combina seguridad, confort y un diseño renovado con mejor aerodinámica. Gracias a su spoiler optimizado y a la mentonera de tela, ofrece mayor estabilidad y comodidad en todo tipo de recorridos. Un casco integral confiable, certificado y preparado para acompañarte en cada viaje.	52990.00	productos/X_casco-moto-ich-503-duko-mate-fc-sm-49451.jpg	f	t	f	2026-03-24 21:12:26.234468+00	9	16	1
49	Casco Integral ICH 503 Neza Bl Sm Integral Certificación Dot Qr	10-casco-moto-ich-503-neza-bl-sm-integral-certific	Casco integral ICH modelo 503, fabricado con carcaza de ABS (termoplástico de alta resistencia) que brinda protección y durabilidad en la conducción diaria. Su diseño incorpora spoiler aerodinámico renovado, mejorando la estabilidad a altas velocidades.\r\n\r\nCuenta con visor externo de policarbonato con protección UV y tratamiento anti-rayaduras, además de sistema de ventilación frontal superior e inferior con salidas posteriores, optimizando la circulación del aire.\r\n\r\nEl interior está desarrollado en EPS (poliestireno de alta densidad) con esponjas laterales removibles, lavables y antibacterial, confeccionadas en microfibra de poliéster para mayor confort. Incluye mentonera textil, cierre micrométrico ajustable y certificación Norma DOT (FMVSS Nº 218), homologado bajo Resolución 1080 (Colombia).	52990.00	productos/X_bp0a0361-photoroom1309.jpg	f	t	f	2026-03-24 21:27:54.1705+00	9	16	1
55	Casco Moto SHAFT 526SP Solid MR Brillo Integral	casco-moto-shaft-526sp-solid-mr-brillo-integral	El Shaft SH-526SP Evo combina seguridad, comodidad y estilo en un diseño integral pensado para quienes buscan máxima protección en cada trayecto. Su carcasa de ABS de alta resistencia ofrece una estructura sólida y confiable, mientras que su interior con tecnología SAT (Shock Absorption Technology) mejora la absorción de impactos para una experiencia de conducción más segura y cómoda.	99990.00	productos/X_casco-shaft-526sp-solid-morado-brillo-4oxs7453.jpg	f	t	f	2026-03-24 21:37:26.008183+00	3	16	1
57	Casco Moto SHAFT Pro 606sp Solid Bg Integral Con Sun Visor (v/sv)	casco-moto-shaft-pro-606sp-solid-bg-integral-con-s	El Shaft Pro SHPRO-606SP es un casco integral diseñado para motociclistas que exigen altos estándares de seguridad, confort y estilo. Fabricado en ABS de alta resistencia y equipado con tecnología avanzada de absorción de impactos, es una opción ideal tanto para uso urbano como para viajes en carretera.\r\n\r\nUn modelo que combina protección certificada con equipamiento premium.	129990.00	productos/X_177891-shpro-606sp-solid-bg-bl-lat0816.png	f	t	f	2026-03-24 21:40:37.638327+00	3	16	1
58	Casco Moto SHAFT 526SP EVO Master Of The Sea Integral	casco-moto-shaft-526sp-evo-master-of-the-sea-az-og	El casco integral Shaft SH-526SP EVO está diseñado para brindar seguridad, confort y ajuste ergonómico, ideal para conducción urbana y en carretera. Su carcaza de ABS de alta resistencia junto con el interior con tecnología SAT de absorción de impactos ofrecen una mayor protección en cada trayecto.\r\n\r\nCuenta con tapizado interior de lujo personalizado, confeccionado en tela 100% poliéster antibacterial, además de cubre barbilla textil que ayuda a reducir el ingreso de viento. Incorpora visor de policarbonato con protección UV y tratamiento anti-rayaduras, sistema de ventilaciones frontales y superiores regulables, y salidas posteriores fijas que favorecen la evacuación del aire.	119990.00	productos/X_0007-sh-526sp-evo-master-of-sea-az-os-gr-lat4242.jpg	f	t	f	2026-03-24 21:42:52.568897+00	3	16	1
53	Casco Moto SHAFT 502sp Solid Ng Neon Yellow Integral Normal Dot Acreditado	0-casco-moto-shaft-502sp-solid-ng-neon-yellow-inte	El Shaft 502 combina protección, comodidad y estilo, ideal para quienes buscan seguridad y confort tanto en ciudad como en carretera. Su carcaza de ABS de alta resistencia junto con el interior con tecnología SAT de absorción de impactos brindan mayor protección en cada recorrido.\r\n\r\nIncorpora interior en EPS de alta densidad, removible, lavable y antibacterial en microfibra de poliéster, además de cubre barbilla textil que reduce el ingreso de viento. Cuenta con visor de policarbonato con protección UV y tratamiento anti-rayaduras, preparado para Pinlock®, y un eficiente sistema de ventilación con entradas frontales y salidas posteriores que mantiene una adecuada circulación de aire.\r\n\r\nIncluye cierre micrométrico ajustable, está preparado para intercomunicador y posee certificación internacional Norma DOT, con homologación Conaset mediante código QR para uso en Chile.	69990.00	productos/X_shaft-502sp-solid-ng-ama-17172.png	f	t	f	2026-03-24 21:33:59.258333+00	3	16	1
56	Casco Moto SHAFT 560 Evo Wuoki Gr.os Am.n Integral	casco-moto-shaft-560-evo-wuoki-gr-os-am-n-integral	Casco Integral Shaft SH-560 EVO\r\n\r\nEl casco integral Shaft SH-560 EVO está diseñado para ofrecer máxima seguridad, confort y rendimiento aerodinámico, siendo ideal tanto para uso urbano como en carretera. Su carcaza de ABS de alta resistencia junto con el interior con tecnología SAT de absorción de impactos brindan mayor protección en cada trayecto.\r\n\r\nCuenta con tapizado interior de lujo en tela 100% poliéster antibacterial, detalles reflectantes y cubre barbilla textil que ayuda a reducir el ingreso de viento. Incorpora alerón rediseñado para mejorar la aerodinámica, visor de policarbonato con protección UV y tratamiento anti-rayaduras, además de sistema de ventilación superior AirBooster Technology, que canaliza el flujo de aire hacia las zonas críticas para una mejor refrigeración.	99990.00	productos/X_0002-sh-560-evo-wuoki-gr-os-am-lat8000.jpg	f	t	f	2026-03-24 21:39:42.206391+00	3	16	1
21	Casco AIROH Matryx Rocket Rojo Brillo	casco-airoh-matryx-rocket-rojo-brillo	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_rojo_1.webp	f	t	f	2026-03-17 02:24:14.05374+00	2	16	1
28	Casco AIROH Matryx Scope Light Gris Brillo	casco-airoh-matryx-scope-light-gris-brillo	Casco deportivo e integral fabricado en compuesto de carbono de alta resistencia y ligereza con spoiler trasero para una mayor aerodinámica. Dispone de una amplia pantalla resistente a los arañazos y rayos UV que se completa con los sistemas A3S (Airoh Automatic Antifog System) y sistema de bloqueo. Incorpora el sistema ATVR (Airoh Tool-less Visor Removal) para poder desmontar la pantalla fácilmente. El sistema de ventilación se compone de entradas de aire en la zona superior y salidas en la parte trasera para una eficiente aireación. Cierre mediante DD Ring (doble hebilla metálica).	340990.00	productos/Airoh_Matryx_Rocket_Scope_light_grey_1.webp	f	t	f	2026-03-17 02:29:06.500184+00	2	16	1
2	Casco AIROH Commander 2 Reveal Rojo Fluor Mate	casco-airoh-commander-2-reveal-rojo-fluor-mate	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/galeria/Casco_Airoh_Commander_2_Reveal_Rojo_Fluor_Mate.webp	f	t	f	2026-03-17 00:02:39.054329+00	2	16	1
63	Casco Inventado	casco-inventado	inventadisimo	15000.00		f	t	f	2026-04-01 01:26:31.401455+00	\N	16	1
4	Casco AIROH Commander 2 Reveal Azul Rojo Brillo	casco-airoh-commander-2-reveal-azul-rojo-brillo	Casco de estilo Trail con calota fabricada en carbono compuesto de alta resistencia y ligereza. Incorpora la tecnología ASN y el sistema de fácil extracción A.E.F.R. El sistema de ventilación destaca por su diseño probado en el túnel de viento. Amplia pantalla resistente a los arañazos y rayos UV. Incorpora visor solar interior y visera desmontable. Cierre de doble hebilla.	539990.00	productos/Casco_Airoh_Commander_2_Reveal_Azul_Rojo_Brillo_0616f9ef-3cef-4fa7-9a8e-664707506610.webp	f	t	f	2026-03-17 00:04:35.757915+00	2	16	1
\.


--
-- Data for Name: token_blacklist_blacklistedtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_blacklistedtoken (id, blacklisted_at, token_id) FROM stdin;
1	2026-03-16 11:10:34.945642+00	3
2	2026-03-16 11:53:29.654631+00	6
3	2026-03-16 15:07:32.348779+00	10
4	2026-03-16 20:20:10.612688+00	12
5	2026-03-16 21:37:35.984166+00	15
6	2026-03-16 22:05:23.313184+00	16
8	2026-03-16 23:58:14.879426+00	17
9	2026-03-17 00:55:45.27391+00	22
10	2026-03-17 01:43:55.277657+00	23
11	2026-03-17 02:14:11.669652+00	26
12	2026-03-17 03:08:42.268941+00	28
13	2026-03-17 03:40:52.336286+00	30
14	2026-03-17 11:59:46.338301+00	33
16	2026-03-18 02:13:25.233162+00	38
17	2026-03-18 02:52:06.685685+00	39
18	2026-03-18 02:52:06.887001+00	40
20	2026-03-18 16:33:43.897986+00	42
22	2026-03-18 16:33:44.560943+00	43
23	2026-03-18 17:04:24.1587+00	46
24	2026-03-18 18:00:11.59236+00	48
27	2026-03-18 18:58:26.882533+00	52
29	2026-03-18 19:53:37.275617+00	55
30	2026-03-18 20:30:51.151163+00	57
32	2026-03-18 21:26:53.884324+00	59
35	2026-03-19 00:08:42.243821+00	65
36	2026-03-19 00:56:04.677938+00	66
37	2026-03-19 00:56:04.923476+00	67
38	2026-03-19 01:41:07.458793+00	69
40	2026-03-19 02:28:05.409101+00	72
42	2026-03-19 02:59:28.888119+00	75
43	2026-03-19 13:01:03.913599+00	77
45	2026-03-19 13:35:59.86707+00	80
46	2026-03-19 21:45:37.542785+00	81
50	2026-03-22 21:08:04.266619+00	86
53	2026-03-23 15:20:18.004125+00	90
57	2026-03-24 00:21:47.985526+00	95
59	2026-03-24 00:53:33.461089+00	98
60	2026-03-24 01:13:56.012141+00	100
61	2026-03-24 11:31:49.520542+00	103
62	2026-03-24 12:05:09.11931+00	105
65	2026-03-24 13:08:21.053148+00	110
66	2026-03-24 13:21:08.753116+00	113
67	2026-03-24 13:30:32.041014+00	114
68	2026-03-24 13:31:04.778086+00	116
69	2026-03-24 14:50:21.235047+00	117
70	2026-03-24 19:49:02.025786+00	124
71	2026-03-24 20:22:34.888424+00	126
72	2026-03-24 21:10:28.901117+00	130
73	2026-03-24 21:40:37.249662+00	131
74	2026-03-24 22:11:57.147352+00	132
75	2026-03-24 23:10:35.767125+00	134
76	2026-03-25 00:01:13.083721+00	137
77	2026-03-25 00:31:13.280696+00	138
78	2026-03-25 01:03:03.076794+00	139
79	2026-03-25 01:34:01.507407+00	140
80	2026-03-25 14:37:52.947232+00	142
82	2026-03-25 15:16:45.053889+00	145
83	2026-03-25 16:16:54.869497+00	147
84	2026-03-25 19:18:10.689087+00	149
87	2026-03-25 19:48:28.759896+00	153
88	2026-03-25 20:18:44.549156+00	154
89	2026-03-25 20:58:33.352783+00	155
90	2026-03-25 21:37:55.638979+00	156
91	2026-03-25 22:16:15.478429+00	158
92	2026-03-25 22:50:49.214999+00	159
93	2026-03-25 23:45:09.619521+00	161
94	2026-03-26 00:15:45.271663+00	165
95	2026-03-26 00:53:57.778953+00	166
96	2026-03-26 01:28:19.97395+00	168
97	2026-03-26 02:06:46.51401+00	170
98	2026-03-26 02:37:16.457924+00	171
99	2026-03-26 03:13:32.872228+00	173
100	2026-03-26 15:04:14.817127+00	174
101	2026-03-26 15:35:14.627441+00	175
102	2026-03-26 16:29:30.575574+00	176
103	2026-03-26 17:00:10.034833+00	177
104	2026-03-26 19:51:24.322266+00	178
105	2026-03-26 20:28:30.596845+00	179
106	2026-03-26 20:59:55.309858+00	180
107	2026-03-26 21:36:27.107698+00	181
108	2026-03-26 22:09:38.30674+00	182
109	2026-03-26 22:50:31.81076+00	183
110	2026-03-26 23:20:37.44746+00	184
111	2026-03-26 23:50:47.717927+00	185
112	2026-03-27 00:20:52.655707+00	186
113	2026-03-27 00:51:44.164228+00	187
114	2026-03-27 01:29:59.272612+00	188
115	2026-03-27 12:06:46.008387+00	190
116	2026-03-27 17:33:49.632124+00	192
117	2026-03-27 18:05:53.256238+00	194
118	2026-03-27 18:36:02.199001+00	195
119	2026-03-27 19:06:08.840867+00	196
120	2026-03-27 20:08:50.009562+00	197
121	2026-03-27 20:41:11.18527+00	199
122	2026-03-27 23:03:56.982454+00	200
123	2026-03-27 23:43:26.495447+00	201
124	2026-03-28 02:01:59.534551+00	204
125	2026-03-28 13:16:51.107116+00	205
126	2026-03-28 14:35:37.580115+00	208
127	2026-03-29 14:56:19.413934+00	209
128	2026-03-29 15:24:54.253821+00	210
129	2026-03-29 16:02:08.767177+00	211
130	2026-03-29 17:05:40.651096+00	212
131	2026-03-29 18:14:14.979452+00	213
132	2026-03-29 18:44:14.806045+00	214
133	2026-03-29 20:17:26.675477+00	216
135	2026-03-29 23:21:21.950651+00	217
136	2026-03-30 00:23:35.507791+00	220
137	2026-03-30 12:00:33.717259+00	222
138	2026-03-30 12:11:22.0764+00	223
139	2026-03-30 12:11:39.298443+00	224
140	2026-03-30 13:17:06.960775+00	226
141	2026-03-30 17:43:44.996104+00	253
142	2026-03-30 18:14:15.669235+00	255
143	2026-03-30 18:50:47.908093+00	257
144	2026-03-30 19:21:23.566525+00	259
145	2026-03-30 20:20:17.550544+00	251
146	2026-03-30 20:50:49.466535+00	265
148	2026-03-30 21:21:02.950179+00	268
149	2026-03-30 21:51:10.757615+00	270
150	2026-03-30 22:30:18.227148+00	272
151	2026-03-31 01:46:58.91401+00	276
152	2026-03-31 01:46:59.221089+00	277
153	2026-03-31 02:17:07.022337+00	279
155	2026-03-31 02:51:47.238166+00	282
157	2026-03-31 12:45:33.271977+00	284
158	2026-03-31 14:35:53.262175+00	288
159	2026-03-31 21:33:29.013016+00	293
160	2026-04-01 00:24:09.529223+00	296
161	2026-04-01 01:10:55.542712+00	299
162	2026-04-01 01:45:32.837297+00	301
164	2026-04-01 02:24:03.315562+00	304
165	2026-04-01 02:24:03.652625+00	337
166	2026-04-01 03:06:10.360301+00	340
167	2026-04-01 03:39:49.463082+00	343
168	2026-04-01 13:26:06.322347+00	345
169	2026-04-01 13:57:16.582003+00	347
170	2026-04-01 14:30:16.956926+00	350
172	2026-04-01 15:34:03.448722+00	353
174	2026-04-01 16:04:09.689642+00	356
175	2026-04-01 19:03:39.197093+00	358
176	2026-04-01 19:36:09.296491+00	360
177	2026-04-01 19:36:09.563416+00	361
179	2026-04-01 20:13:33.463637+00	363
180	2026-04-01 22:08:12.109965+00	370
181	2026-04-01 22:45:58.220803+00	372
183	2026-04-01 23:35:50.410028+00	375
184	2026-04-02 00:14:13.684402+00	377
185	2026-04-02 00:46:55.39339+00	378
187	2026-04-02 01:17:37.553201+00	381
188	2026-04-02 01:28:50.264638+00	291
189	2026-04-02 01:52:45.091511+00	382
191	2026-04-02 02:23:38.84268+00	387
192	2026-04-02 03:03:27.265882+00	388
193	2026-04-02 03:03:28.195623+00	389
194	2026-04-02 03:13:04.179616+00	384
196	2026-04-02 19:54:05.225142+00	391
198	2026-04-02 22:05:52.323143+00	399
\.


--
-- Data for Name: token_blacklist_outstandingtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_outstandingtoken (id, token, created_at, expires_at, user_id, jti) FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDIyNjUwMSwiaWF0IjoxNzczNjIxNzAxLCJqdGkiOiI4MWI1NTFlMDIwZGU0MWE0YjMyYjEwMTUzMzVmZDNlYyIsInVzZXJfaWQiOiIxIn0.N4r4d1xkdWyi5oABdMxl6jBkf1YLBAsY2gkJGwu8Rh8	2026-03-16 00:41:41.791556+00	2026-03-23 00:41:41+00	1	81b551e020de41a4b32b1015335fd3ec
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDIyNzQ4MSwiaWF0IjoxNzczNjIyNjgxLCJqdGkiOiJkOTcwOTIzMjc0Njg0NjU1YThhNzczNjRhNWFiMGJiMyIsInVzZXJfaWQiOiIxIn0.FK4cLYuxERGbWy5h13Qwz6EpIU3sDRiLDK8xIJbiiZQ	2026-03-16 00:58:01.698846+00	2026-03-23 00:58:01+00	1	d970923274684655a8a77364a5ab0bb3
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDIyODQ1MiwiaWF0IjoxNzczNjIzNjUyLCJqdGkiOiJjMWVmNzdjMmUyM2U0NGE2YjJiNmJjZjExNGUyYTkzNyIsInVzZXJfaWQiOiIxIn0.j1yoq76D9-F7MiVTah43uwMxETz4Ovmey5fQzIAfVSc	2026-03-16 01:14:12.513654+00	2026-03-23 01:14:12+00	1	c1ef77c2e23e44a6b2b6bcf114e2a937
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NDIzNCwiaWF0IjoxNzczNjU5NDM0LCJqdGkiOiI2YmY2ZjExYTgwMmE0MmQxYTU2OGE2MDQ5NDdlN2NlNyIsInVzZXJfaWQiOiIxIn0.sc_TvsDSTLbjYoW-sZMQTTJ3j_M0B_D-pkcUzA0NiOw	2026-03-16 11:10:34.646611+00	2026-03-23 11:10:34+00	1	6bf6f11a802a42d1a568a604947e7ce7
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NDc2NSwiaWF0IjoxNzczNjU5OTY1LCJqdGkiOiI0MGRlMzkyMjJlZmQ0MGJiOTY0ODc0YTRmMTM2ZGJmZiIsInVzZXJfaWQiOiIxIn0.PEhyIZ4gCQVl1OUaxdRbhQmcRo4Gk4wPMaqb-U9WH8g	2026-03-16 11:19:25.224327+00	2026-03-23 11:19:25+00	1	40de39222efd40bb964874a4f136dbff
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NDc4OCwiaWF0IjoxNzczNjU5OTg4LCJqdGkiOiI1ZjUyMWRjYjc3ZDM0YjQ0YmRhOTQ1MTVlMTA2ZjdkNSIsInVzZXJfaWQiOiIyIn0.WFsRVbYOH-hUSNN2vdYp4IyG3kDYYOiwbE6h7staiZU	2026-03-16 11:19:48.358236+00	2026-03-23 11:19:48+00	2	5f521dcb77d34b44bda94515e106f7d5
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NjgwOSwiaWF0IjoxNzczNjYyMDA5LCJqdGkiOiJhNzA1MTAyM2I4MzY0ZmYyYjU4Y2M1ZmZhYjc0NTY5OSIsInVzZXJfaWQiOiIyIn0.EERVJDDfgwkU13aHL7ZY1AODyZVOFqOXzmPTgBAqBbo	2026-03-16 11:53:29.558321+00	2026-03-23 11:53:29+00	2	a7051023b8364ff2b58cc5ffab745699
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NjgwOSwiaWF0IjoxNzczNjYyMDA5LCJqdGkiOiI0M2FkMTMwNWFjMGU0OTAzYTc3MTc3NzYxMzczNTNiMyIsInVzZXJfaWQiOiIyIn0.8F_oIcOm0QCUIWzeyO5orLpWs7hU0P3IhxM1N4eHSZs	2026-03-16 11:53:29.561026+00	2026-03-23 11:53:29+00	2	43ad1305ac0e4903a7717776137353b3
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2Njg5MywiaWF0IjoxNzczNjYyMDkzLCJqdGkiOiI0ZTAxYTQxYjY2NzQ0NzYxYjQ3NDE5OTgxOTlmZTY1OSIsInVzZXJfaWQiOiIyIn0.fWTEDqHD-htsFqWCIngcl1Ja3JbufIfaDb2ncrXMR_8	2026-03-16 11:54:53.806213+00	2026-03-23 11:54:53+00	2	4e01a41b66744761b4741998199fe659
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI2NjkyOCwiaWF0IjoxNzczNjYyMTI4LCJqdGkiOiJlZjA0NzRmZjVmNWE0NzMzYjJiN2E3ZmI1OWQ4ODBlYSIsInVzZXJfaWQiOiIyIn0.6OweXvaKXyqN3C7mdxWWssDiG7OdmFJQ5Bk7F-slCy0	2026-03-16 11:55:28.033011+00	2026-03-23 11:55:28+00	2	ef0474ff5f5a4733b2b7a7fb59d880ea
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI3ODQ1MiwiaWF0IjoxNzczNjczNjUyLCJqdGkiOiIwYjBhMWRlNzdmYmU0OWUzYTRjYmRhNjkxNGExMDVkOSIsInVzZXJfaWQiOiIyIn0.snvOU95oTx_6QdgMiVYjOQp31AwhzRQh0Kw8TU_Tm0M	2026-03-16 15:07:32.238159+00	2026-03-23 15:07:32+00	2	0b0a1de77fbe49e3a4cbda6914a105d9
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI3OTA2NSwiaWF0IjoxNzczNjc0MjY1LCJqdGkiOiI4ZTg0YjI4ZDNkMjE0MWVkYTE0NDMzYzFjNmFkZDE1ZCIsInVzZXJfaWQiOiIyIn0.SN2DbFqEBp6dOQpYzoghTsZSzOD-CGN47rp4EpaNUXQ	2026-03-16 15:17:45.137567+00	2026-03-23 15:17:45+00	2	8e84b28d3d2141eda14433c1c6add15d
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI5NzIxMCwiaWF0IjoxNzczNjkyNDEwLCJqdGkiOiI1MzY2NTllZmUxYTk0YWIzODU0MzU1MTEzNzhjNjUyMiIsInVzZXJfaWQiOiIyIn0.YTW8XOeHcfTOPbqFNVucO7iNaPk8XqhTD4hHyGvcN38	2026-03-16 20:20:10.473558+00	2026-03-23 20:20:10+00	2	536659efe1a94ab385435511378c6522
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI5NzIxMCwiaWF0IjoxNzczNjkyNDEwLCJqdGkiOiIxNTg2NjJhY2E3YTg0MjI4OWQ4YmJhNzRhNmM1MGMwNyIsInVzZXJfaWQiOiIyIn0.Yu2T1eLYr3n9IdZU3-VCLDifFcVdUHYR-dci_3sLWig	2026-03-16 20:20:10.488034+00	2026-03-23 20:20:10+00	2	158662aca7a842289d8bba74a6c50c07
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDI5NzI1MSwiaWF0IjoxNzczNjkyNDUxLCJqdGkiOiIzYjZmZTYyOTQwNzE0NDczYjkxNjk0YzdiYmE4N2MyZCIsInVzZXJfaWQiOiIyIn0.1ppm9Zfj80fG6g-Qih4Th4ovIHbk49bR00kiSFNEGPU	2026-03-16 20:20:51.795169+00	2026-03-23 20:20:51+00	2	3b6fe62940714473b91694c7bba87c2d
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMwMTg1NSwiaWF0IjoxNzczNjk3MDU1LCJqdGkiOiI5OTgzNzU1MTY0NDY0MDIxODlkNjg5NDAyZGNmNTA5MyIsInVzZXJfaWQiOiIyIn0.DKS9wQX39e82T4GwIrWCSE-birR4krckOoy6q1ydIek	2026-03-16 21:37:35.929771+00	2026-03-23 21:37:35+00	2	998375516446402189d689402dcf5093
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMwMzcwMCwiaWF0IjoxNzczNjk4OTAwLCJqdGkiOiIwNWVlNTZmNDQ0NTM0NTBlYjMwNjQ0ZmYxYjM3M2ZlYiIsInVzZXJfaWQiOiIyIn0.8qsMDFIWFFg2gMPm9_6d1eKBFx3DxT2YJ257aYdXzdE	2026-03-16 22:08:20.323085+00	2026-03-23 22:08:20+00	2	05ee56f44453450eb30644ff1b373feb
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMDI5NCwiaWF0IjoxNzczNzA1NDk0LCJqdGkiOiJkMTNkNmExMzQ2NTY0NWQ4OWFiNjdmZTRiZGUxODc0MyIsInVzZXJfaWQiOiIyIn0.DdOiutC0TolBBXnvQA-srcMNkfZYeW1E8o1iH2ky2eE	2026-03-16 23:58:14.759276+00	2026-03-23 23:58:14+00	2	d13d6a13465645d89ab67fe4bde18743
19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMDI5NCwiaWF0IjoxNzczNzA1NDk0LCJqdGkiOiIwMjI0MjZmODMwOTE0MjY1YTA5MmRkMjQ3N2I1N2ZhNyIsInVzZXJfaWQiOiIyIn0.Ka66E8q54-7ZyVM8IXIGB9djhYlUzin2eCzeEhNdlwU	2026-03-16 23:58:14.751363+00	2026-03-23 23:58:14+00	2	022426f830914265a092dd2477b57fa7
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMDI5NCwiaWF0IjoxNzczNzA1NDk0LCJqdGkiOiI4MjJhYmM1M2UwMDI0MmY4OWEzMTVhMGNjNThmZmUyMiIsInVzZXJfaWQiOiIyIn0.sbn27sqNn4e_SL0bsL90ykWLHj_6h766zqp2RSG361A	2026-03-16 23:58:14.752926+00	2026-03-23 23:58:14+00	2	822abc53e00242f89a315a0cc58ffe22
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMDMxMiwiaWF0IjoxNzczNzA1NTEyLCJqdGkiOiI0ZDhkYWRlMDE3NTA0ZjRiOGI2YTdhNjNlZTAwZTY0NCIsInVzZXJfaWQiOiIyIn0.6u2mjUtzZIAVSHMsq7ZRhiHWpqLKKozAQkg33JAjnMk	2026-03-16 23:58:32.445783+00	2026-03-23 23:58:32+00	2	4d8dade017504f4b8b6a7a63ee00e644
22	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMTA5MSwiaWF0IjoxNzczNzA2MjkxLCJqdGkiOiIzMWE1NWZmNjAwMzI0NTM2OGQwYThlODBlNGZhY2JiOSIsInVzZXJfaWQiOiIyIn0.X0pwqd4_glFibfloykb6PUv1nJyUM_s0CvY11shEMTY	2026-03-17 00:11:31.914909+00	2026-03-24 00:11:31+00	2	31a55ff6003245368d0a8e80e4facbb9
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxMzc0NSwiaWF0IjoxNzczNzA4OTQ1LCJqdGkiOiI2OGVkYzRmYWEzNDQ0MTc3YWZjNmViMjQzZDNkOGY4YiIsInVzZXJfaWQiOiIyIn0.SYjJ3bXQ0vf9Ymu7DGkOJIA9g7Pajb_3IMAAwi33WHo	2026-03-17 00:55:45.217132+00	2026-03-24 00:55:45+00	2	68edc4faa3444177afc6eb243d3d8f8b
24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxNjYzNSwiaWF0IjoxNzczNzExODM1LCJqdGkiOiIwZWU4NmFjNGU2ZTE0ZDk2OWQxOGIzNTcxOGVjZTc5YiIsInVzZXJfaWQiOiIyIn0.6TwaAXmhBjC4szcqMrLg-jrhsNtpoyHh6PCNvpelaTU	2026-03-17 01:43:55.184451+00	2026-03-24 01:43:55+00	2	0ee86ac4e6e14d969d18b35718ece79b
25	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxNjYzNSwiaWF0IjoxNzczNzExODM1LCJqdGkiOiJkZGI3Y2ZlNzE3OTE0NzNkYWQ3NWU3MGQwZDcxOTkxOCIsInVzZXJfaWQiOiIyIn0.zTknJ19jajV7Ak91vCxglOF52zOA_Oqc5jbD4CYz_0k	2026-03-17 01:43:55.179037+00	2026-03-24 01:43:55+00	2	ddb7cfe71791473dad75e70d0d719918
27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxNjYzNSwiaWF0IjoxNzczNzExODM1LCJqdGkiOiIwMTA2ZmFlZjVjMTg0YjFlOGE1Mzk3NDVkYWY0ZTcxNCIsInVzZXJfaWQiOiIyIn0.JI5ED8feQm-jX7Ovs9xObULDQ47tNYgtkYzMxf9Dv1U	2026-03-17 01:43:55.186372+00	2026-03-24 01:43:55+00	2	0106faef5c184b1e8a539745daf4e714
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxNjYzNSwiaWF0IjoxNzczNzExODM1LCJqdGkiOiIyMzQxZGRiYjUxZmY0ZTVjYTNlZWFhM2RjZjNmMjA5YiIsInVzZXJfaWQiOiIyIn0.HanbjUfBrTHFRtEvNE6DQ0ER8z8n5qvYOsNOMDuRcZ0	2026-03-17 01:43:55.173489+00	2026-03-24 01:43:55+00	2	2341ddbb51ff4e5ca3eeaa3dcf3f209b
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMxODQ1MSwiaWF0IjoxNzczNzEzNjUxLCJqdGkiOiIzNTY2NTMwNDBiN2Y0ZGQ0OGE2MjIxOWFkYWRhNDdhNSIsInVzZXJfaWQiOiIyIn0.351Zt-jBk6l4kZBZtnEOEXEGvsynEE7GALyUtrjP-mk	2026-03-17 02:14:11.610082+00	2026-03-24 02:14:11+00	2	356653040b7f4dd48a62219adada47a5
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMyMTcyMiwiaWF0IjoxNzczNzE2OTIyLCJqdGkiOiJmZDliMTljMDFiNGE0MzRmODMyNmM4NTk1MGFhNzBjMSIsInVzZXJfaWQiOiIyIn0.nAfucCPxilv9WhsNLuIpzzTBL-bbv0zXyOXqEPcD1ko	2026-03-17 03:08:42.19765+00	2026-03-24 03:08:42+00	2	fd9b19c01b4a434f8326c85950aa70c1
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMyMTc4NywiaWF0IjoxNzczNzE2OTg3LCJqdGkiOiJlYjIyNWNhZDIyMWI0NTA3OWVmZTE2YzkzNGVjNWU0NiIsInVzZXJfaWQiOiIyIn0.ryPfHwdhl0nSEs4uiT8KHdty7Fs9wOAC3MzOFTd_VrA	2026-03-17 03:09:47.309086+00	2026-03-24 03:09:47+00	2	eb225cad221b45079efe16c934ec5e46
31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMyMzY1MiwiaWF0IjoxNzczNzE4ODUyLCJqdGkiOiIxNzZiM2E3NTJhNTk0ZTIyOGU3Yzc5NmRjMzU2ZmViNyIsInVzZXJfaWQiOiIyIn0.-NXB8jLq7-zwiIbn726PdC6HfALOA4IgzceksAtxWIM	2026-03-17 03:40:52.224728+00	2026-03-24 03:40:52+00	2	176b3a752a594e228e7c796dc356feb7
32	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMyMzgxNSwiaWF0IjoxNzczNzE5MDE1LCJqdGkiOiJmN2ZmMjNmYTViMTQ0NTY5YTBiOWQ4OGUwMzVjZjYyYyIsInVzZXJfaWQiOiIyIn0.jpVER1gB1CVKC1eBLvMU7-0gIigwL_s4olSnnBuBDy4	2026-03-17 03:43:35.789954+00	2026-03-24 03:43:35+00	2	f7ff23fa5b144569a0b9d88e035cf62c
33	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDMyNDA1OSwiaWF0IjoxNzczNzE5MjU5LCJqdGkiOiJjNDY5ODNhNTg5YzM0YjNmODQ2N2I3ZjIxMTk5NzQyYSIsInVzZXJfaWQiOiIyIn0.0B2vMJlLQ2GMMmRSoAaeRv3sxeWXwVQNQ2Fdw1w4rOg	2026-03-17 03:47:39.405338+00	2026-03-24 03:47:39+00	2	c46983a589c34b3f8467b7f21199742a
34	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDM1MzU4NiwiaWF0IjoxNzczNzQ4Nzg2LCJqdGkiOiIyOTdmYjRkNDQ0OTE0ZGQxOGQ5YWNiZjVlMzFhZGE1MCIsInVzZXJfaWQiOiIyIn0.hroQt-SmQuBEujVVbBGVeiUEF_U_rpQUXAGtnKMdlKo	2026-03-17 11:59:46.207806+00	2026-03-24 11:59:46+00	2	297fb4d444914dd18d9acbf5e31ada50
35	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDM1MzU4NiwiaWF0IjoxNzczNzQ4Nzg2LCJqdGkiOiJiNmE2NGY3ZjU2MDA0MDYwYjkzYmQ5NGVlYzUzZWFlZiIsInVzZXJfaWQiOiIyIn0.2UpzeQwwflXQj_g9KL7OgOS2TOakf89BtudyuXRKSrY	2026-03-17 11:59:46.205645+00	2026-03-24 11:59:46+00	2	b6a64f7f56004060b93bd94eec53eaef
36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDM1MzU4NiwiaWF0IjoxNzczNzQ4Nzg2LCJqdGkiOiJjNjFiOTkyNTNhNGI0YTg4OTJlZGMwM2E0YmMzYjhkYiIsInVzZXJfaWQiOiIyIn0.DwpY_qdOwT9xW3d0hEms8rs3_YkLxqQvTOmYpRTRpTw	2026-03-17 11:59:46.210679+00	2026-03-24 11:59:46+00	2	c61b99253a4b4a8892edc03a4bc3b8db
37	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDM1NDAwNCwiaWF0IjoxNzczNzQ5MjA0LCJqdGkiOiJmNTZhYzI2Y2NmN2I0NTVkOTMxMDdmMmVhZTA3NjEwNyIsInVzZXJfaWQiOiIyIn0.cK4XEsIEn0MlUstsMC76w3CRhATKwAR4IgYzVkYCPh4	2026-03-17 12:06:44.739228+00	2026-03-24 12:06:44+00	2	f56ac26ccf7b455d93107f2eae076107
38	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQwMTc1MiwiaWF0IjoxNzczNzk2OTUyLCJqdGkiOiI5MmJmNGM3MGUwMDI0YzY0OTNlNDQ2NDE3OTVkZjdiYSIsInVzZXJfaWQiOiIyIn0.MVar9DnNG1b3TSw-Wrhb4tpCWYTbkZMilqxWGQC-6Js	2026-03-18 01:22:32.45575+00	2026-03-25 01:22:32+00	2	92bf4c70e0024c6493e44641795df7ba
39	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQwNDgwNSwiaWF0IjoxNzczODAwMDA1LCJqdGkiOiJmMjIxMTU3N2M4ZDQ0YTc0YWYwMDQxYjQ2OWNmNDEzNyIsInVzZXJfaWQiOiIyIn0.XwgqUGM_SyIG0u166V-YowDaiQnhLoXMiwCw0QUN9gc	2026-03-18 02:13:25.162573+00	2026-03-25 02:13:25+00	2	f2211577c8d44a74af0041b469cf4137
40	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQwNzEyNiwiaWF0IjoxNzczODAyMzI2LCJqdGkiOiJjNDlhMWJjZTY0NzE0OTBmODcxMzIwMjkyZDZhYmJiMCIsInVzZXJfaWQiOiIyIn0.zxMwIJjqhpJtlFZsAF24i6oQ5Po6aNnlvK7eA7UXcmQ	2026-03-18 02:52:06.607538+00	2026-03-25 02:52:06+00	2	c49a1bce6471490f871320292d6abbb0
41	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQwNzEyNiwiaWF0IjoxNzczODAyMzI2LCJqdGkiOiIyYmE4NTk1ZGY4NTA0Y2UzYmFlNzRjN2ViNTdmMzY3NSIsInVzZXJfaWQiOiIyIn0.z8BKR_iePj2VVt0dZYQeO1J6kskx-bxO0dBcsEk4tIU	2026-03-18 02:52:06.772399+00	2026-03-25 02:52:06+00	2	2ba8595df8504ce3bae74c7eb57f3675
42	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQwNzQ1MiwiaWF0IjoxNzczODAyNjUyLCJqdGkiOiJmNGI5YzViMmYwOTA0OWE0OWQwZDIwYTNiMjdmZjA2ZiIsInVzZXJfaWQiOiIyIn0.U3KRhtHLpfyXOC2C-xyS_JT7Wk_Lrp_WGw9B_YMnaJE	2026-03-18 02:57:32.009241+00	2026-03-25 02:57:32+00	2	f4b9c5b2f09049a49d0d20a3b27ff06f
43	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1NjQyMywiaWF0IjoxNzczODUxNjIzLCJqdGkiOiJjZmVmNmI0ODIzNmU0MjU3YmY0MDAwZTczOGQ0NThjOSIsInVzZXJfaWQiOiIyIn0.g0BUcL_mpWW77KdfdTXzNOMTRZO6bQ7TeyC-mtbje3c	2026-03-18 16:33:43.551665+00	2026-03-25 16:33:43+00	2	cfef6b48236e4257bf4000e738d458c9
44	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1NjQyMywiaWF0IjoxNzczODUxNjIzLCJqdGkiOiJmMDkwMWY5Y2YyY2E0ZjczYTY5MWE0NjBkMmVmZGVhOSIsInVzZXJfaWQiOiIyIn0.kkuiggGORNnYTDZ9GwuOrooKdgZT7bC8gJHJT2BTseQ	2026-03-18 16:33:43.635996+00	2026-03-25 16:33:43+00	2	f0901f9cf2ca4f73a691a460d2efdea9
45	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1NjQyMywiaWF0IjoxNzczODUxNjIzLCJqdGkiOiI3YmQxOWFjYjJkYjQ0MmVmODJjOTc3OTdlNmFkZDhkYyIsInVzZXJfaWQiOiIyIn0.o4XBlrWmOM3k2s2WyxSkRJV1CD48YFnbPKoNwt4uy3s	2026-03-18 16:33:43.603642+00	2026-03-25 16:33:43+00	2	7bd19acb2db442ef82c97797e6add8dc
46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1NjQyNCwiaWF0IjoxNzczODUxNjI0LCJqdGkiOiJjMTYwZjZlNDFhYjY0ZjZhODEyOGU1NjVkMTFmNzVjOCIsInVzZXJfaWQiOiIyIn0.OZGtT9RLhTKtgViC5i1p0l9yDME2ksukQ9XPvOW22GY	2026-03-18 16:33:44.292569+00	2026-03-25 16:33:44+00	2	c160f6e41ab64f6a8128e565d11f75c8
47	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1ODI2NCwiaWF0IjoxNzczODUzNDY0LCJqdGkiOiJjODRlY2RhODdmMzk0ZGM2YTM4MWQ4ZGEzYzI5Njk5NCIsInVzZXJfaWQiOiIyIn0.zO3FzdQBTz2NCOCMp9ZtalbcpJNNqm_HoVnsfDFENks	2026-03-18 17:04:24.104975+00	2026-03-25 17:04:24+00	2	c84ecda87f394dc6a381d8da3c296994
48	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ1ODI2NSwiaWF0IjoxNzczODUzNDY1LCJqdGkiOiJkMThhZTM5NmQ2NTQ0MjEyODlkNzRjMTg0YmI1YzAzYiIsInVzZXJfaWQiOiIyIn0.aPIyvT9GPHnIUcmZvZ0lWo2gaUDeLZIChMPyAOtnBhk	2026-03-18 17:04:25.304181+00	2026-03-25 17:04:25+00	2	d18ae396d654421289d74c184bb5c03b
49	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2MTYxMSwiaWF0IjoxNzczODU2ODExLCJqdGkiOiI3OTRmYWFkYjNkZGY0ZDI0YmI1M2JhOGVmNDE2NDkxMyIsInVzZXJfaWQiOiIyIn0.MbRbv80pwqKNT0b_hm5KnWAo4wRqvlDc32QP-C8ehYA	2026-03-18 18:00:11.464814+00	2026-03-25 18:00:11+00	2	794faadb3ddf4d24bb53ba8ef4164913
50	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2MTYxMSwiaWF0IjoxNzczODU2ODExLCJqdGkiOiIxZDc5YjE2MTY0Mzk0MjhhODlmNmJiY2Y4YzcxNjdjOSIsInVzZXJfaWQiOiIyIn0.AtDMqwGV_yo49nB-vC-fmcjwFiK5AtHI-gtEqyFevVk	2026-03-18 18:00:11.456321+00	2026-03-25 18:00:11+00	2	1d79b1616439428a89f6bbcf8c7167c9
51	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2MTYxMSwiaWF0IjoxNzczODU2ODExLCJqdGkiOiJiMjMwMzQzNzk4OWU0YjE0ODU2MDk3ODdkNTQ1MGQ4ZiIsInVzZXJfaWQiOiIyIn0.9q4vT4IYAABVZTXE8PqZIZGWgXXhV61-03aP346nqsk	2026-03-18 18:00:11.479402+00	2026-03-25 18:00:11+00	2	b2303437989e4b1485609787d5450d8f
52	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2MjQ0NiwiaWF0IjoxNzczODU3NjQ2LCJqdGkiOiIxYjAyYzgzNGNiN2U0MTg1YmE5ZTk2MzcwMmI3YjU5YiIsInVzZXJfaWQiOiIyIn0.n-C7ighPgTZgU5VjxS3khBy1RiTR_1hOlNIp48Q6Lks	2026-03-18 18:14:06.83737+00	2026-03-25 18:14:06+00	2	1b02c834cb7e4185ba9e963702b7b59b
54	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2NTEwNiwiaWF0IjoxNzczODYwMzA2LCJqdGkiOiI2OTYzMjJmOGIzYjg0ZDA5OTc3NWM0MWViNTQ1MjYyNCIsInVzZXJfaWQiOiIyIn0.dVNdNttPsC2yZV-IbJACtlP4adJd156TjfmP0pTnjTI	2026-03-18 18:58:26.817692+00	2026-03-25 18:58:26+00	2	696322f8b3b84d099775c41eb5452624
53	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2NTEwNiwiaWF0IjoxNzczODYwMzA2LCJqdGkiOiJhZTlmYzI2ZjExMWI0MTEyODY4NzRmMWZlNWRmZjUzOSIsInVzZXJfaWQiOiIyIn0.mmqgCL0ZP15MBvq_8FvDjsI8z6-g6m1Sh72DxMY4EcA	2026-03-18 18:58:26.803256+00	2026-03-25 18:58:26+00	2	ae9fc26f111b411286874f1fe5dff539
55	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2NTY1NSwiaWF0IjoxNzczODYwODU1LCJqdGkiOiJmYTM4NjAzNmVhOTE0Y2MxOGNkMmRkZDZmZTY0ZmU4YyIsInVzZXJfaWQiOiIyIn0.maB6Ch7QqXMAbTRvF_vkPJ0YQOCxlX-g4ToTxNHS3TY	2026-03-18 19:07:35.498764+00	2026-03-25 19:07:35+00	2	fa386036ea914cc18cd2ddd6fe64fe8c
56	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2ODQxNywiaWF0IjoxNzczODYzNjE3LCJqdGkiOiIwNDNkNDljZjYzMDA0OWFjOWIyNWQzNWQyNWM4NDU5MCIsInVzZXJfaWQiOiIyIn0.ZlDOx6-Z7GtYS2eOQUxqjBvkwnyrRB8IJswJmOzWwGY	2026-03-18 19:53:37.037085+00	2026-03-25 19:53:37+00	2	043d49cf630049ac9b25d35d25c84590
57	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ2ODQ3NywiaWF0IjoxNzczODYzNjc3LCJqdGkiOiJhZmEwZDVmOTRmMWQ0NzJhOTIxOTJkY2JkMDhmMjRmNSIsInVzZXJfaWQiOiIyIn0.QHodiXE8TD3jsDSE8KHTBy7xdvpEIzZDv2fwv-GdaJQ	2026-03-18 19:54:37.243626+00	2026-03-25 19:54:37+00	2	afa0d5f94f1d472a92192dcbd08f24f5
58	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3MDY1MSwiaWF0IjoxNzczODY1ODUxLCJqdGkiOiIxM2VjNzFkMWIyNGY0MjZlYjlkNDg1M2FjZGQzOGRiMyIsInVzZXJfaWQiOiIyIn0.22ODYfljza9Y9p6_JExzEzBfukWPvGammYs04yD7IFY	2026-03-18 20:30:51.034042+00	2026-03-25 20:30:51+00	2	13ec71d1b24f426eb9d4853acdd38db3
59	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3MDcyMywiaWF0IjoxNzczODY1OTIzLCJqdGkiOiJjMTcwZWVhZDdiZDI0MjZhYWNmMDYzYjFiMWI1ZThjZiIsInVzZXJfaWQiOiIyIn0.ON8XNcmNRvlXlbnAsIIJfM20Npf1WsEcVcqz8UTuYXQ	2026-03-18 20:32:03.1604+00	2026-03-25 20:32:03+00	2	c170eead7bd2426aacf063b1b1b5e8cf
60	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDAxMywiaWF0IjoxNzczODY5MjEzLCJqdGkiOiIyMjgzNDFiYTIzZWE0OWY4OWQ3MDlkMzBjMmJlMzU5YyIsInVzZXJfaWQiOiIyIn0.3BVUzYGIPw-4x9A1EmTPDytc-M2w1Na-F6nwiw1q9v0	2026-03-18 21:26:53.738714+00	2026-03-25 21:26:53+00	2	228341ba23ea49f89d709d30c2be359c
61	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDAxMywiaWF0IjoxNzczODY5MjEzLCJqdGkiOiJjYjlmMjA5YTU1ZDE0NTc4YjYwNTEwNjZmODMwZjIzZSIsInVzZXJfaWQiOiIyIn0.z0Pc3PuumpjEhBN7Qv92Qsn77kTuOzQ0ZMVe-ShnLBY	2026-03-18 21:26:53.732795+00	2026-03-25 21:26:53+00	2	cb9f209a55d14578b6051066f830f23e
62	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDAxMywiaWF0IjoxNzczODY5MjEzLCJqdGkiOiI3YjM0Y2MzZDcyNGQ0NDhiOTEyMGY4ZTMzMmU5MTcxYiIsInVzZXJfaWQiOiIyIn0.EDsjr99EUlwqIerk5E2IrrDAANbgThnQ0SrRPJWjp-M	2026-03-18 21:26:53.744412+00	2026-03-25 21:26:53+00	2	7b34cc3d724d448b9120f8e332e9171b
63	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDAxMywiaWF0IjoxNzczODY5MjEzLCJqdGkiOiI3Y2RkMzY1OTgxOWI0ZDYwOWE3MzZmZDI2YTZjZTdiYiIsInVzZXJfaWQiOiIyIn0.XfLt1bTJWGwmWUQOIDX_pcBmqofJ_nicFAxmq2EvJng	2026-03-18 21:26:53.746255+00	2026-03-25 21:26:53+00	2	7cdd3659819b4d609a736fd26a6ce7bb
64	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDAxOSwiaWF0IjoxNzczODY5MjE5LCJqdGkiOiIyODliNWM3NDVhODU0MzBkOGZlNTIxZmY3NjBhMjc1OSIsInVzZXJfaWQiOiIyIn0.VCxhVyAKa0W4_WE0eU8Q-JTJYn0x7vofdufBValSohI	2026-03-18 21:26:59.763275+00	2026-03-25 21:26:59+00	2	289b5c745a85430d8fe521ff760a2759
65	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ3NDk1NywiaWF0IjoxNzczODcwMTU3LCJqdGkiOiIyM2M3MWMwZDcyMWY0NDJiYmM1OWM4ZWEwZjM4YzVkMyIsInVzZXJfaWQiOiIyIn0.O5r_PnkAhU9lVaj3N8Vdr4JI7wU8HXIadGnEAnaEMXU	2026-03-18 21:42:37.799011+00	2026-03-25 21:42:37+00	2	23c71c0d721f442bbc59c8ea0f38c5d3
66	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4MzcyMiwiaWF0IjoxNzczODc4OTIyLCJqdGkiOiI4MGNkYjk2ODA0MDM0NTY4YTE2YjFjMjQyNjg4ZGMyNyIsInVzZXJfaWQiOiIyIn0.V8HYf4DDaNvCtZVVVzSeQbjWdTB3b1weCEOGRYni3-o	2026-03-19 00:08:42.187543+00	2026-03-26 00:08:42+00	2	80cdb96804034568a16b1c242688dc27
67	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4NjU2NCwiaWF0IjoxNzczODgxNzY0LCJqdGkiOiIzZTcyZmVjMThkOGY0YjJhOTAzZDI1NGE5YmE1MjM0NyIsInVzZXJfaWQiOiIyIn0.ceR5MEro38ugaNljgHzcwDpBWysvhC7iM9OXXY--lpk	2026-03-19 00:56:04.588224+00	2026-03-26 00:56:04+00	2	3e72fec18d8f4b2a903d254a9ba52347
68	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4NjU2NCwiaWF0IjoxNzczODgxNzY0LCJqdGkiOiJhZTY0NzNkNTZkNmY0YTBhOWY2YWIxNzkwOThiZjhhZSIsInVzZXJfaWQiOiIyIn0.JZB9uSub0dSIelbpN_ra7QnPOukBWYixFbFwIQTPk7w	2026-03-19 00:56:04.834588+00	2026-03-26 00:56:04+00	2	ae6473d56d6f4a0a9f6ab179098bf8ae
69	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4NzQzNCwiaWF0IjoxNzczODgyNjM0LCJqdGkiOiI5MTEyNWFjZjQ4NGM0NTVmOWRkNGI4MDQ1YTgxMzNjOSIsInVzZXJfaWQiOiIyIn0.oS2hbenozDh_C2Ff9nyUPcPKaVGYNRcJlqHkkBQRGmw	2026-03-19 01:10:34.699518+00	2026-03-26 01:10:34+00	2	91125acf484c455f9dd4b8045a8133c9
70	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4OTI2NywiaWF0IjoxNzczODg0NDY3LCJqdGkiOiJhMTA4MmE0YWEyNzY0NmIxYWNiOTI5Zjg1NjlmZWNiZiIsInVzZXJfaWQiOiIyIn0.9AqHyqb37jLFw1u8OzPQExWxqbzLLZLKZqRp920AzGQ	2026-03-19 01:41:07.354706+00	2026-03-26 01:41:07+00	2	a1082a4aa27646b1acb929f8569fecbf
71	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ4OTI2NywiaWF0IjoxNzczODg0NDY3LCJqdGkiOiI2MTJjOTk2OTdjZmY0MjBiOGI3M2NhOTQ0NjQ1ODI4YSIsInVzZXJfaWQiOiIyIn0.CdoW0HLa2lewcLZ7qKkZYF9BfLbj0j0kCMpscHausA8	2026-03-19 01:41:07.373964+00	2026-03-26 01:41:07+00	2	612c99697cff420b8b73ca944645828a
72	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5MDI3OCwiaWF0IjoxNzczODg1NDc4LCJqdGkiOiI1MjAyOTdiOGJmNTA0ZjdkOGJhMDA3NDgyY2RjZDI1YSIsInVzZXJfaWQiOiIyIn0.FGHuNyKczhcioCnWQJsnBwyMi6Sav-KKD4B-4YwrlJE	2026-03-19 01:57:58.516189+00	2026-03-26 01:57:58+00	2	520297b8bf504f7d8ba007482cdcd25a
73	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5MjA4NSwiaWF0IjoxNzczODg3Mjg1LCJqdGkiOiJiNWE5ODc2MjRlMDk0OTU1OWEzMzM0MjgxYjE0MjRmMSIsInVzZXJfaWQiOiIyIn0.YUv1MpXbwXrX5GyFKlSYiP3AwyWtfoePk-nKMJKM2us	2026-03-19 02:28:05.316613+00	2026-03-26 02:28:05+00	2	b5a987624e0949559a3334281b1424f1
74	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5MjA4NSwiaWF0IjoxNzczODg3Mjg1LCJqdGkiOiIyMTEzYjA4NTFlOWY0MzNhYWI0YTM4OWM2NTY2NmVmMCIsInVzZXJfaWQiOiIyIn0.Mnq_oyXvLGUC8EyrwCmRF2ov05ml0m2KqnOlIkQCZ_o	2026-03-19 02:28:05.328158+00	2026-03-26 02:28:05+00	2	2113b0851e9f433aab4a389c65666ef0
75	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5MjExNywiaWF0IjoxNzczODg3MzE3LCJqdGkiOiI0YzZkNTYyOTE4ZmU0YzU2OWJiYzQyMjJlZDgyOTI1MyIsInVzZXJfaWQiOiIyIn0.Qjvhm61usyA1XZppzDyVL-nxg7CCtOmK3EqHjadNCes	2026-03-19 02:28:37.519497+00	2026-03-26 02:28:37+00	2	4c6d562918fe4c569bbc4222ed829253
76	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5Mzk2OCwiaWF0IjoxNzczODg5MTY4LCJqdGkiOiJiNGRhMWFlMTYzMjY0NGE1YmMyZGUzZDVhY2RiNWNiNSIsInVzZXJfaWQiOiIyIn0.PQyt-Gar_EGMTytWc9w8IzJsYjY3xsMwNmNIvOu41-g	2026-03-19 02:59:28.649484+00	2026-03-26 02:59:28+00	2	b4da1ae1632644a5bc2de3d5acdb5cb5
77	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDQ5NDA2MywiaWF0IjoxNzczODg5MjYzLCJqdGkiOiJmNzcwNGVkYTZlOTc0MjdhYTg5MGNhZGNjYTBhMjcyYyIsInVzZXJfaWQiOiIyIn0.xMC_Gl3RGiDaP1xEClmcYJqLYTEPt-ZrOwWQnseHuAk	2026-03-19 03:01:03.161793+00	2026-03-26 03:01:03+00	2	f7704eda6e97427aa890cadcca0a272c
78	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDUzMDA2MywiaWF0IjoxNzczOTI1MjYzLCJqdGkiOiIwZjE1Mjc0ZDI4NTI0MzM1ODAyNDdlMjgyNTIyODUwNiIsInVzZXJfaWQiOiIyIn0.ZO8lTDHeLsKKRiEFrLaQD25XJwh4RDCWtXd_LsjgKPs	2026-03-19 13:01:03.747632+00	2026-03-26 13:01:03+00	2	0f15274d2852433580247e2825228506
79	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDUzMDA2MywiaWF0IjoxNzczOTI1MjYzLCJqdGkiOiIxYTkyOWQyYmQ0NDg0MDBmODcyM2U5ZWNkNzQ1MmNlZSIsInVzZXJfaWQiOiIyIn0.vhUGEb8O0TkXjKKyM-sdviVDlHMfDF8hfmqfEvrcn4Y	2026-03-19 13:01:03.771876+00	2026-03-26 13:01:03+00	2	1a929d2bd448400f8723e9ecd7452cee
80	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDUzMDA3MywiaWF0IjoxNzczOTI1MjczLCJqdGkiOiIxNzUyZGNjYzZhMjE0MWViODUxNTg4YWQ0OTYwOTIwZCIsInVzZXJfaWQiOiIyIn0.dRykQfDcYnhTsL1FvlBAjIMUiC87dim8DHRwP23MQuQ	2026-03-19 13:01:13.40001+00	2026-03-26 13:01:13+00	2	1752dccc6a2141eb851588ad4960920d
81	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDUzMjE1OSwiaWF0IjoxNzczOTI3MzU5LCJqdGkiOiJiOTc0Njk1MjRiODc0NmFlOGJjNzQyY2FiNzVhZDYyNCIsInVzZXJfaWQiOiIyIn0.qwhkg_xqqAimkZ2XncxqBq8jASkVoiQk2I6aiclga-Y	2026-03-19 13:35:59.812565+00	2026-03-26 13:35:59+00	2	b97469524b8746ae8bc742cab75ad624
82	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDU2MTUzNywiaWF0IjoxNzczOTU2NzM3LCJqdGkiOiI5ZjBjODE1NjkxZDQ0YTc5YjhhMTBhYTkwYWQ0ZmI4ZiIsInVzZXJfaWQiOiIyIn0.MCcmdbaQIH09Z6fRNB9YJHkUr5UBzokK_qgrQFLP86Q	2026-03-19 21:45:37.408358+00	2026-03-26 21:45:37+00	2	9f0c815691d44a79b8a10aa90ad4fb8f
83	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDU2MTUzNywiaWF0IjoxNzczOTU2NzM3LCJqdGkiOiI3ZDVhMDhjNmFlODA0ZTI2ODU3MGM5ZGRlNzkwOWI1OSIsInVzZXJfaWQiOiIyIn0.h4DpvvJ9DQXF4to5CD7vtiE9ZvGqIO6zFYyJKWSsRek	2026-03-19 21:45:37.42541+00	2026-03-26 21:45:37+00	2	7d5a08c6ae804e268570c9dde7909b59
85	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDU2MTUzNywiaWF0IjoxNzczOTU2NzM3LCJqdGkiOiIxMTA4ODBmY2RkM2I0NjY5OGI2OTVkYzQ1ZjAyNDdjMyIsInVzZXJfaWQiOiIyIn0.95i4uLr9zvNvhjfTAK9l2FSsgHx6RLuT6PrVTNvMnLg	2026-03-19 21:45:37.404837+00	2026-03-26 21:45:37+00	2	110880fcdd3b46698b695dc45f0247c3
84	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDU2MTUzNywiaWF0IjoxNzczOTU2NzM3LCJqdGkiOiJlNzMzZTA5M2JkNDQ0NGI4OTFmMGYxZmY0MTZiYzc0MiIsInVzZXJfaWQiOiIyIn0.jcN7FXcjuGYdzrjDqID4qIGve_PgTk6VDkdLz2fDjuA	2026-03-19 21:45:37.418225+00	2026-03-26 21:45:37+00	2	e733e093bd4444b891f0f1ff416bc742
86	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDY1MTEzMCwiaWF0IjoxNzc0MDQ2MzMwLCJqdGkiOiI3OGNmNjQyOGI2MGU0NDQ4YTYwODQ3NzQ3ZDA5YjQzOSIsInVzZXJfaWQiOiIyIn0.sDswIqT_vKJmZjSm5RhklyfLGyUPU03MmQZ46SDTmpQ	2026-03-20 22:38:50.318489+00	2026-03-27 22:38:50+00	2	78cf6428b60e4448a60847747d09b439
87	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDgxODQ4NCwiaWF0IjoxNzc0MjEzNjg0LCJqdGkiOiIyZWIyZDZhZDA5Mzk0ZWZmYTc0NTNlMmQ2YWEwNDc4ZCIsInVzZXJfaWQiOiIyIn0.1ZykyHzp182KobWmgE5-BmPtUxtAB9YnP7pYl5dwp4k	2026-03-22 21:08:04.145058+00	2026-03-29 21:08:04+00	2	2eb2d6ad09394effa7453e2d6aa0478d
88	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDgxODQ4NCwiaWF0IjoxNzc0MjEzNjg0LCJqdGkiOiIyYTVmNDRkYmEzMjE0ODM3ODRmN2VlMGE0MzllNzk5ZSIsInVzZXJfaWQiOiIyIn0.b5vtpM9IiHgUp_E8HDAr7-WXzlgSN_-K3bCWyETeVoY	2026-03-22 21:08:04.05395+00	2026-03-29 21:08:04+00	2	2a5f44dba321483784f7ee0a439e799e
89	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDgxODQ4NCwiaWF0IjoxNzc0MjEzNjg0LCJqdGkiOiI3YmEyMjcxMTBjY2M0YWVhOTJlZDc4ZDU0ZDkxMzIwNyIsInVzZXJfaWQiOiIyIn0.GQFV9wevNZdCalgtqRyDrdrQxJGHKioaiUbqB2UYd9Y	2026-03-22 21:08:04.097068+00	2026-03-29 21:08:04+00	2	7ba227110ccc4aea92ed78d54d913207
90	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDgyODc1MCwiaWF0IjoxNzc0MjIzOTUwLCJqdGkiOiIyZjdiZWFiYmYxMmM0NWNlYWFkN2E3ZDNiZTQzZTY2YyIsInVzZXJfaWQiOiIyIn0.IYgUa2UuEWSYznp5OAl5zgPWJUVpEvMY08RCMZTNMPE	2026-03-22 23:59:10.263477+00	2026-03-29 23:59:10+00	2	2f7beabbf12c45ceaad7a7d3be43e66c
93	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg4NDAxNywiaWF0IjoxNzc0Mjc5MjE3LCJqdGkiOiIyYzkyMTZmZTkwN2E0OTI2OTA5OWIyOGYyZjE3NDdmMCIsInVzZXJfaWQiOiIyIn0.ElFTCepEB3f8x0nNCDvdas8upnVebx7-pSYVkx5o-Pw	2026-03-23 15:20:17.957614+00	2026-03-30 15:20:17+00	2	2c9216fe907a49269099b28f2f1747f0
94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg4NDAxNywiaWF0IjoxNzc0Mjc5MjE3LCJqdGkiOiJmNmRiZWMyMzI3YmI0ZmJhOTAyZDMyYTkxYTczMTFhOSIsInVzZXJfaWQiOiIyIn0.xNSTKg7jje3xtH3BpFgNPk9TBfnIba69OPMnR3pe-9k	2026-03-23 15:20:17.914028+00	2026-03-30 15:20:17+00	2	f6dbec2327bb4fba902d32a91a7311a9
92	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg4NDAxNywiaWF0IjoxNzc0Mjc5MjE3LCJqdGkiOiJiYjM3Y2ViNjk4NGQ0YTRlYWFjMDRhNzY4OWQ1YjI1MiIsInVzZXJfaWQiOiIyIn0.KGZwoiKqVcRHPIQXPMJS6Tni-SVddXgeObEg6o1PSNA	2026-03-23 15:20:17.921759+00	2026-03-30 15:20:17+00	2	bb37ceb6984d4a4eaac04a7689d5b252
91	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg4NDAxNywiaWF0IjoxNzc0Mjc5MjE3LCJqdGkiOiJlYWVkMzI0OGYxM2U0MTkzYTE4MzYxMDA0ODBiNDAzYSIsInVzZXJfaWQiOiIyIn0.UnV8pQCAVkdOg3xqDDFhTdIajWT9n_uLS9LaA-FgmRE	2026-03-23 15:20:17.904431+00	2026-03-30 15:20:17+00	2	eaed3248f13e4193a1836100480b403a
95	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg4NDA0NSwiaWF0IjoxNzc0Mjc5MjQ1LCJqdGkiOiJhNTI1NjNhN2JhODY0NTA1OTQ5MTgwZGJiZWVlZGU1ZSIsInVzZXJfaWQiOiIyIn0.WpKjy2Eg0VZKDIl1eZpCz5-8C06cpGN55OlYzhP84zU	2026-03-23 15:20:45.294239+00	2026-03-30 15:20:45+00	2	a52563a7ba864505949180dbbeeede5e
96	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxNjUwNywiaWF0IjoxNzc0MzExNzA3LCJqdGkiOiI2Y2ZlY2YyNzNkMTQ0NTg1ODA0OWU3MmQwNTQ1YzJmNyIsInVzZXJfaWQiOiIyIn0.0Z8oMCVN-A2aGgIl0MuR2eBQBzabvxRze5HJ3YkDJBs	2026-03-24 00:21:47.661575+00	2026-03-31 00:21:47+00	2	6cfecf273d1445858049e72d0545c2f7
97	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxNjUwNywiaWF0IjoxNzc0MzExNzA3LCJqdGkiOiIyMjhiOGU5ZjEzOGY0NjQ4YWNlMzdkNGY1NjUzYTNkZiIsInVzZXJfaWQiOiIyIn0.B-gBNYDqyR2L2HOFayRzDnON3sl130zGNWY9M1P-8ZY	2026-03-24 00:21:47.628105+00	2026-03-31 00:21:47+00	2	228b8e9f138f4648ace37d4f5653a3df
98	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxNjUzMSwiaWF0IjoxNzc0MzExNzMxLCJqdGkiOiIyNjEyYWNiNjkxMzU0YTk1YTE5MzY0YmMwZDg2ZGJlNSIsInVzZXJfaWQiOiIyIn0.Jn8aBCP8nVz0zBWJJwRRlRS0c85XhN7pyOU3yhlk19Y	2026-03-24 00:22:11.999175+00	2026-03-31 00:22:11+00	2	2612acb691354a95a19364bc0d86dbe5
99	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxODQxMywiaWF0IjoxNzc0MzEzNjEzLCJqdGkiOiI5NmYxZTYxN2I3NTQ0ZGZjOThiODZjODU0ZmUyYzExNiIsInVzZXJfaWQiOiIyIn0.f6vgY43aZLPibiANbUjka7uJWtz1YSwo8j_TA3y9vEY	2026-03-24 00:53:33.280483+00	2026-03-31 00:53:33+00	2	96f1e617b7544dfc98b86c854fe2c116
100	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxODQxOSwiaWF0IjoxNzc0MzEzNjE5LCJqdGkiOiJlN2YzZjgzODVlZDk0ZDdiYTJhNWUzYWY3YWNiM2Q5ZCIsInVzZXJfaWQiOiIyIn0.Sj-mcceAWMxXzwP-nUi-jJbzB0xqfm9MN_jyGtoKMRk	2026-03-24 00:53:39.885646+00	2026-03-31 00:53:39+00	2	e7f3f8385ed94d7ba2a5e3af7acb3d9d
101	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkxOTg2NiwiaWF0IjoxNzc0MzE1MDY2LCJqdGkiOiI3YWY0NjRmNTIyMzA0NzBlOThmMDYyMTRlZTU0NTBhMSIsInVzZXJfaWQiOiIyIn0.bmmx0VGKR4RoXuVkLLpfEuTnB9HaL2kyqmy572cju-Q	2026-03-24 01:17:46.813872+00	2026-03-31 01:17:46+00	2	7af464f52230470e98f06214ee5450a1
102	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkyMTUxNCwiaWF0IjoxNzc0MzE2NzE0LCJqdGkiOiJjYTM3MjEwOTVkNzk0YTUwYjdiMDVkODk0YTE5NWMxZiIsInVzZXJfaWQiOiIyIn0.D3scLeQONpiQx6qoIvdNONAL6fl5anJyZ5sASjqnSDA	2026-03-24 01:45:14.597138+00	2026-03-31 01:45:14+00	2	ca3721095d794a50b7b05d894a195c1f
103	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkyMzk2MSwiaWF0IjoxNzc0MzE5MTYxLCJqdGkiOiIxYTM0NDk5MjQ1NDU0ODk1OWRkNTIwMjhjMWUyOTY5MSIsInVzZXJfaWQiOiIyIn0.fhXkP0NOtTt2HcRLeLDnqab2az-d5xAaQo9nYwHov0U	2026-03-24 02:26:01.555211+00	2026-03-31 02:26:01+00	2	1a344992454548959dd52028c1e29691
104	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1NjcwOSwiaWF0IjoxNzc0MzUxOTA5LCJqdGkiOiI5NmE4YWYzMGZjMGQ0NWQ2OWIwYjAzM2E3ZWNlOTM4YSIsInVzZXJfaWQiOiIyIn0.QGdP9ve8giCGIkWX3_e8v6yNY7gEFPWkoyoEq68LCRs	2026-03-24 11:31:49.438082+00	2026-03-31 11:31:49+00	2	96a8af30fc0d45d69b0b033a7ece938a
105	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1Njc1NywiaWF0IjoxNzc0MzUxOTU3LCJqdGkiOiIwOTQxNGU3ODE1ZjI0Y2IzYTlkMzg2YjQ2ODYwOTJkNiIsInVzZXJfaWQiOiIyIn0.GfXwVSLehF6IiVwMK5T9uUKOzcCArDAIdmmRiL016Wo	2026-03-24 11:32:37.318704+00	2026-03-31 11:32:37+00	2	09414e7815f24cb3a9d386b4686092d6
106	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1ODcwOCwiaWF0IjoxNzc0MzUzOTA4LCJqdGkiOiIxYzBmNzgzYTZmMjc0NTUwYWZlNDk3NzA1YTIyMTk4MCIsInVzZXJfaWQiOiIyIn0.NdDLM80IZQ1vvFoXxr8swWGtkh87amg5bzQFtgIKNqI	2026-03-24 12:05:08.937161+00	2026-03-31 12:05:08+00	2	1c0f783a6f274550afe497705a221980
107	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1ODcwOCwiaWF0IjoxNzc0MzUzOTA4LCJqdGkiOiI0MGI5MjQwYzMwYjQ0MzgxYjc1ZGQ2OGYxZWFhNzEzNCIsInVzZXJfaWQiOiIyIn0.T8KFmgh5mzSAt8ScJOcR478twZyvOK4lVnzf1Xgg8MA	2026-03-24 12:05:08.987595+00	2026-03-31 12:05:08+00	2	40b9240c30b44381b75dd68f1eaa7134
108	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1ODcwOCwiaWF0IjoxNzc0MzUzOTA4LCJqdGkiOiJlMmZmNGU4ODJlNDA0NTY1OGEyYTA4MDA1MWY2MjlhYSIsInVzZXJfaWQiOiIyIn0.XpBwYP1p7RgxeFmPkQilPORq5qnxyhDuAdIYD4lW3S8	2026-03-24 12:05:08.965833+00	2026-03-31 12:05:08+00	2	e2ff4e882e4045658a2a080051f629aa
109	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1ODcxNiwiaWF0IjoxNzc0MzUzOTE2LCJqdGkiOiIxZTk0OWFjZTczNTA0ZWQxODZmOWY1ZGZlYWQ2MzE2NiIsInVzZXJfaWQiOiIyIn0.JRgcTYU1ZWSzeeJpRSpYcz31yt7jPz3qIrjCBBlhYPA	2026-03-24 12:05:16.499248+00	2026-03-31 12:05:16+00	2	1e949ace73504ed186f9f5dfead63166
110	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk1OTE5OSwiaWF0IjoxNzc0MzU0Mzk5LCJqdGkiOiIxZmNjZTUxYTQ0NjE0NzJhOWYyMTU1OGY3MmVmNmVjYyIsInVzZXJfaWQiOiIyIn0.Wbei0KgWkQCIj_LAFaYAbR1mqYY7iauQNnpNguTfPkg	2026-03-24 12:13:19.897713+00	2026-03-31 12:13:19+00	2	1fcce51a4461472a9f21558f72ef6ecc
111	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2MjUwMSwiaWF0IjoxNzc0MzU3NzAxLCJqdGkiOiIxM2U3YjljYTZhOTM0N2VjYWIzNjgxNTU3YjYyMDJkMiIsInVzZXJfaWQiOiIyIn0.QsudrSkgT7swerQ4_SbKIx4mgCBxXJTPRRhCujidgR4	2026-03-24 13:08:21.019821+00	2026-03-31 13:08:21+00	2	13e7b9ca6a9347ecab3681557b6202d2
112	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2MjUwMSwiaWF0IjoxNzc0MzU3NzAxLCJqdGkiOiI5NTJmZDNjZmVjMTQ0OTkwOTlhYzlhNjBmZDY1ODUyMSIsInVzZXJfaWQiOiIyIn0.Z8KcZLDHGAalWysE85BgMzscNSuSekUhwE8FRVdYAtA	2026-03-24 13:08:21.019653+00	2026-03-31 13:08:21+00	2	952fd3cfec14499099ac9a60fd658521
113	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2MjUwNiwiaWF0IjoxNzc0MzU3NzA2LCJqdGkiOiIyNWFlZTE1Yjg1NjA0NDkzYTYyMGZmMjg3ZGQ0OGNlNiIsInVzZXJfaWQiOiIyIn0.VdIjpTsg0QW-PsXoQhYnU9WK2uUwqfnXOs9OALiANnc	2026-03-24 13:08:26.546578+00	2026-03-31 13:08:26+00	2	25aee15b85604493a620ff287dd48ce6
114	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg5NTAzMiwiaWF0IjoxNzc0MjkwMjMyLCJqdGkiOiJiNTM5MTk3ZWZmYjI0YzkzYTJlNjUyYmQ1MjQ5NTkzNCIsInVzZXJfaWQiOiIyIn0.0FQD9I8gUH_pjzxim7ZWsKnUinR4KzC1GuYMT3tr3Zc	2026-03-24 13:30:32.017277+00	2026-03-30 18:23:52+00	2	b539197effb24c93a2e652bd52495934
115	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2MzgzMiwiaWF0IjoxNzc0MzU5MDMyLCJqdGkiOiJmNjEwZTE5ZmU4MGE0ZDE2OWFlMzQ3NTdjOGMzOGQxNCIsInVzZXJfaWQiOiIyIn0.TJyUmf8AVqgQmfnToj4zwKr7UmZGJ1kRMHkK99oIOUg	2026-03-24 13:30:32.017277+00	2026-03-31 13:30:32+00	2	f610e19fe80a4d169ae34757c8c38d14
116	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2Mzg0MSwiaWF0IjoxNzc0MzU5MDQxLCJqdGkiOiJhZmRiYTUxMWUyNDI0YjlmOThlNTExOGMyMTE1M2NkYiIsInVzZXJfaWQiOiIyIn0.40T2YzZKb1uzCpdyBTc1bYu1Ink7Up-YpaWDajRQzD4	2026-03-24 13:30:41.257056+00	2026-03-31 13:30:41+00	2	afdba511e2424b9f98e5118c21153cdb
117	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2NDQzOSwiaWF0IjoxNzc0MzU5NjM5LCJqdGkiOiJmNDZlZjlmNGI4OTU0ZGNhOGJmZmFhZGFmYTBhNjRhNiIsInVzZXJfaWQiOiIyIn0.a2pRGLa1hLQeSwOK5G8JiXlJsd4GQC5jIEPUAfsaRn0	2026-03-24 13:40:39.747478+00	2026-03-31 13:40:39+00	2	f46ef9f4b8954dca8bffaadafa0a64a6
118	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2ODYyMSwiaWF0IjoxNzc0MzYzODIxLCJqdGkiOiI0OGY3MTFiZDM4OTg0ZWEzOTY4YzdmMWE0ZTg0OWIxOSIsInVzZXJfaWQiOiIyIn0.riOQIU5_H6G7qf0Ecss3xntblxXg7BaOxl4hb2NB5aU	2026-03-24 14:50:21.204228+00	2026-03-31 14:50:21+00	2	48f711bd38984ea3968c7f1a4e849b19
119	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk2ODYyMSwiaWF0IjoxNzc0MzYzODIxLCJqdGkiOiJlNWYzNDRhMTk3MjY0NDA4YmU0ZTdkZDM5YzM2NjljNyIsInVzZXJfaWQiOiIyIn0.6al93LHMGQmLO_OC0kYeyYqBQzjSmJ8feVdWRM3Wf0o	2026-03-24 14:50:21.208848+00	2026-03-31 14:50:21+00	2	e5f344a197264408be4e7dd39c3669c7
120	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk3NDY5OCwiaWF0IjoxNzc0MzY5ODk4LCJqdGkiOiJmODgwY2FhMzhkZmM0MWJhOGIzOTE4Njc5YjRlMjhkNyIsInVzZXJfaWQiOiIyIn0._OqyRJy6SAU_74C37wNbNXPJJ7Jt3FPSLgZ0aSeXZ9g	2026-03-24 16:31:38.36161+00	2026-03-31 16:31:38+00	2	f880caa38dfc41ba8b3918679b4e28d7
121	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk3NzIzOSwiaWF0IjoxNzc0MzcyNDM5LCJqdGkiOiIyM2JjN2I0ZmY3N2U0ZTg4OWZmZWFkZTBmNmQ4N2FhMSIsInVzZXJfaWQiOiIyIn0.UBHKfwIBG0tyjIO6kOfiqHCvHH0q7gUPzo3mv_w082E	2026-03-24 17:13:59.789223+00	2026-03-31 17:13:59+00	2	23bc7b4ff77e4e889ffeade0f6d87aa1
122	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4MDI0MywiaWF0IjoxNzc0Mzc1NDQzLCJqdGkiOiI4MzNhZWUyODEwMDI0Y2FjYTM5ZDUxYjdlOTNlOTUzMCIsInVzZXJfaWQiOiIyIn0.2S7BzzxbYHpvm3ZiqjRmnrl6mWbVFiV0pG5ZeWU20X4	2026-03-24 18:04:03.774886+00	2026-03-31 18:04:03+00	2	833aee2810024caca39d51b7e93e9530
123	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4MDg1NywiaWF0IjoxNzc0Mzc2MDU3LCJqdGkiOiJhYzU5YzE3NGFjNzU0NTgzYWEyNzA0YTM3ZjdlN2IyZiIsInVzZXJfaWQiOiIyIn0.hJ1TCg6vAie0sDoASrLFPdylKCkNH6VUBRputbw6Xro	2026-03-24 18:14:17.346269+00	2026-03-31 18:14:17+00	2	ac59c174ac754583aa2704a37f7e7b2f
124	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4NDczMywiaWF0IjoxNzc0Mzc5OTMzLCJqdGkiOiJiZTIyNWEzZDFiNTc0ZDE0OWI0ZmQ4NWM2MmNkN2FlNyIsInVzZXJfaWQiOiIyIn0.2_TJqqGhGt5CVp3uHfrFzh3sI6W0x1PFMMBRjiZjx30	2026-03-24 19:18:53.298296+00	2026-03-31 19:18:53+00	2	be225a3d1b574d149b4fd85c62cd7ae7
125	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4NjU0MSwiaWF0IjoxNzc0MzgxNzQxLCJqdGkiOiJjZGU1OGU4OWQ5YTU0YmE4ODljYjA2OWUyNmJkZjI5NCIsInVzZXJfaWQiOiIyIn0.qx5mW9TWZXbHe4vLraexgsD1nt9XM1wWFQBi37GqyU8	2026-03-24 19:49:01.974362+00	2026-03-31 19:49:01+00	2	cde58e89d9a54ba889cb069e26bdf294
126	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4NjU0NywiaWF0IjoxNzc0MzgxNzQ3LCJqdGkiOiJjNjlhYjYxOGE3MzE0ZTFkODNiY2RiMzQ1MTU5NTFjNyIsInVzZXJfaWQiOiIyIn0.bGPp7y3nqooa2jhVsZFhL8fvVqGes7XV9kGsSYVCoVg	2026-03-24 19:49:07.146123+00	2026-03-31 19:49:07+00	2	c69ab618a7314e1d83bcdb34515951c7
127	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4NzgzNiwiaWF0IjoxNzc0MzgzMDM2LCJqdGkiOiIyY2M1ZDA2OTg0N2Y0ODRiYTM5ODYzODY4MzNjY2FiYyIsInVzZXJfaWQiOiIyNyJ9.Yq53TQZiC4qHUNyQjlSGDfYbZaIFGOVQnWvZCsPlWOY	2026-03-24 20:10:36.009646+00	2026-03-31 20:10:36+00	27	2cc5d069847f484ba3986386833ccabc
128	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4ODU1NCwiaWF0IjoxNzc0MzgzNzU0LCJqdGkiOiJiMDU5YTU1M2Y4NWY0NjZhYWJhMzhlMmZiNTFhYWY3YiIsInVzZXJfaWQiOiIyIn0.2cTD9l6B6iqhP8Eq9tqDxXXIuUgjWJREYX0wGbXaNVU	2026-03-24 20:22:34.855738+00	2026-03-31 20:22:34+00	2	b059a553f85f466aaba38e2fb51aaf7b
129	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4ODU1NCwiaWF0IjoxNzc0MzgzNzU0LCJqdGkiOiJiOTVlZTUyNDEyZGU0NWM3ODFlNWQ1YzdhODNjYzMyNSIsInVzZXJfaWQiOiIyIn0.ldw1-bUgIrrszSCap3X6ihzRS53nRqZ1nOQCQzm9JWo	2026-03-24 20:22:34.869193+00	2026-03-31 20:22:34+00	2	b95ee52412de45c781e5d5c7a83cc325
130	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk4ODU2MSwiaWF0IjoxNzc0MzgzNzYxLCJqdGkiOiI0NDIwZTZlMDFjZjU0NGM3OTI3NWIwNzY5MjNlZTE3MSIsInVzZXJfaWQiOiIyIn0.ojkQ-GbdZ-3DwOvMmoXUMWs8YpWPrCkYPQRUq4j5gMU	2026-03-24 20:22:41.65608+00	2026-03-31 20:22:41+00	2	4420e6e01cf544c79275b076923ee171
131	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5MTQyOCwiaWF0IjoxNzc0Mzg2NjI4LCJqdGkiOiJkMmIyMjE4OGYwMDg0YmNmYTdkYmUxZTU1YTAyMjgwNSIsInVzZXJfaWQiOiIyIn0.iSawmVlxGubz5KL1ssWile-ijPwm86Lhk2necxXC3Ns	2026-03-24 21:10:28.878672+00	2026-03-31 21:10:28+00	2	d2b22188f0084bcfa7dbe1e55a022805
132	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5MzIzNywiaWF0IjoxNzc0Mzg4NDM3LCJqdGkiOiJhMjg1MTBjZDQ4MTM0YjJlOTE2ZmU0MmU2NmZlZjkxNyIsInVzZXJfaWQiOiIyIn0.gbGEBufqfE5CWSNq1ZksP5upi_0bUEbPInEalaRd540	2026-03-24 21:40:37.227381+00	2026-03-31 21:40:37+00	2	a28510cd48134b2e916fe42e66fef917
133	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5NTExNywiaWF0IjoxNzc0MzkwMzE3LCJqdGkiOiJlMDI4YzBjYjY1ODc0MDI3YWI1OGEwMjAwNzIwZmZiNSIsInVzZXJfaWQiOiIyIn0.JIN0AsS00TRmVYq9bQTt_epjD9bwqBfLoCtAadt68W8	2026-03-24 22:11:57.112735+00	2026-03-31 22:11:57+00	2	e028c0cb65874027ab58a0200720ffb5
134	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5NjY2MCwiaWF0IjoxNzc0MzkxODYwLCJqdGkiOiJmMDFiODk0YTFhZTY0OWYzYWI1ODZiNmE4N2YwN2YzYiIsInVzZXJfaWQiOiIyIn0.X--K00bmQ8UtSF7DcrCWQnsviGBVKrcfVeZ3citNWjo	2026-03-24 22:37:40.375927+00	2026-03-31 22:37:40+00	2	f01b894a1ae649f3ab586b6a87f07f3b
135	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5ODYzNSwiaWF0IjoxNzc0MzkzODM1LCJqdGkiOiI4OTllMGQ2NmVmNzM0NmM1ODBkZmIzOWZjZjNhOWEyNCIsInVzZXJfaWQiOiIyIn0.l0_PdrWtOX4a-s-D30hQWbGhnDFM_k8HNP0PgYUTmS4	2026-03-24 23:10:35.711965+00	2026-03-31 23:10:35+00	2	899e0d66ef7346c580dfb39fcf3a9a24
136	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5ODYzNSwiaWF0IjoxNzc0MzkzODM1LCJqdGkiOiI4MzgxMjg0NWM3OTU0ZWFjYjFmYmMyMWJmODk4NTcwZSIsInVzZXJfaWQiOiIyIn0.iN6pS1ah0GxOsUChnPhVfXdKep5Xm3RfZBZ86W_xCp0	2026-03-24 23:10:35.728655+00	2026-03-31 23:10:35+00	2	83812845c7954eacb1fbc21bf898570e
137	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDk5ODY1MCwiaWF0IjoxNzc0MzkzODUwLCJqdGkiOiI5NThiOWE2NTEyODE0ZmQ3YTYxOWQ3OTEwNDhlM2MwYyIsInVzZXJfaWQiOiIyIn0.yLXiZe5WmZKCsN8ttdWDnNi_VQpLUgsakOqIwyvTz8Q	2026-03-24 23:10:50.025673+00	2026-03-31 23:10:50+00	2	958b9a6512814fd7a619d791048e3c0c
138	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTAwMTY3MywiaWF0IjoxNzc0Mzk2ODczLCJqdGkiOiI1NjViZDA1MjY2ZTk0MWJjYjczM2UzODU3OTllOGZiOCIsInVzZXJfaWQiOiIyIn0.t2CvR6MWnBdtYbmgidWHfeG0EmyXhhXszP-f8KbLuNM	2026-03-25 00:01:13.054401+00	2026-04-01 00:01:13+00	2	565bd05266e941bcb733e385799e8fb8
139	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTAwMzQ3MywiaWF0IjoxNzc0Mzk4NjczLCJqdGkiOiJiYTQ1ZmY1ODdjOWE0YTA3YjVhYmFlNWQ3YjI4MjM3YSIsInVzZXJfaWQiOiIyIn0.WWb2Laf3cKNjmUqXyaRUkkKoDOJ1kow-0DJBKQI9E1o	2026-03-25 00:31:13.250986+00	2026-04-01 00:31:13+00	2	ba45ff587c9a4a07b5abae5d7b28237a
140	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTAwNTM4MywiaWF0IjoxNzc0NDAwNTgzLCJqdGkiOiI2MDQ3NjQ4OGQ1NTg0NDNjYmQ1NTQwODRmZTBjMGI0OCIsInVzZXJfaWQiOiIyIn0.neEyoY37Ih0IgpF6KegDgr8zyrPBgTn5-9ASmc9IClE	2026-03-25 01:03:03.054052+00	2026-04-01 01:03:03+00	2	60476488d558443cbd554084fe0c0b48
141	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTAwNzI0MSwiaWF0IjoxNzc0NDAyNDQxLCJqdGkiOiIzNTJjYTg0MDI0MTQ0MjNkOTFmNDIyNzExNTE3NDA3NiIsInVzZXJfaWQiOiIyIn0.asIKHVLxUVxiCjjAF5Uxr1WDkXJCyHUUa1NB-HGUMiQ	2026-03-25 01:34:01.481634+00	2026-04-01 01:34:01+00	2	352ca8402414423d91f4227115174076
142	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTAwNzI0NiwiaWF0IjoxNzc0NDAyNDQ2LCJqdGkiOiIyOTZhNWFlMGYyYWY0MmZhYWU2ODEzNGQzOWNiM2ZmOSIsInVzZXJfaWQiOiIyIn0.t_y6_PZLS3yTRh22zheI0enOb7yCaTrpfJTNx34fDjM	2026-03-25 01:34:06.746213+00	2026-04-01 01:34:06+00	2	296a5ae0f2af42faae68134d39cb3ff9
143	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA1NDI3MiwiaWF0IjoxNzc0NDQ5NDcyLCJqdGkiOiI0MmFhYzk1NzRiZjY0ODY0ODQyZDYwNTZiZTlhMDAzZSIsInVzZXJfaWQiOiIyIn0.jy8VEV0wCvlznuiy6adT97rAfH2QA6jQDhWYIs3sP_U	2026-03-25 14:37:52.904898+00	2026-04-01 14:37:52+00	2	42aac9574bf64864842d6056be9a003e
144	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA1NDI3MiwiaWF0IjoxNzc0NDQ5NDcyLCJqdGkiOiJjNWFkMzRjNGExY2Q0Y2NjYWRkYjdiYjI4MjUwNGFlMCIsInVzZXJfaWQiOiIyIn0.O-04iLrGH-iXAeoL9hhVUy97iG8k27gAnibVmMyhdtQ	2026-03-25 14:37:52.921594+00	2026-04-01 14:37:52+00	2	c5ad34c4a1cd4cccaddb7bb282504ae0
145	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA1NDI3OSwiaWF0IjoxNzc0NDQ5NDc5LCJqdGkiOiI4ZTcwNTE1YjllY2M0YzE2YjdiNzU5NTc5NGFkMGZmYyIsInVzZXJfaWQiOiIyIn0.9k0l12reHC8Impv1mcUnJ8kIRlUg9znm0cObX4fGxX4	2026-03-25 14:37:59.601037+00	2026-04-01 14:37:59+00	2	8e70515b9ecc4c16b7b7595794ad0ffc
146	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA1NjYwNCwiaWF0IjoxNzc0NDUxODA0LCJqdGkiOiJlY2ZkOTliNmJiYmU0OTUwYjE2Y2Y2ODk5NDhlODE2YyIsInVzZXJfaWQiOiIyIn0.TPOlxcH72irUWvriJ3Ea9j9fWotkZXOl8qi7dkgLb6M	2026-03-25 15:16:44.997463+00	2026-04-01 15:16:44+00	2	ecfd99b6bbbe4950b16cf689948e816c
147	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA1NjYxMCwiaWF0IjoxNzc0NDUxODEwLCJqdGkiOiI1Yjc0MzgzYTAwYWI0ODJiYjI0OTIwMzdhMjljMTI1NyIsInVzZXJfaWQiOiIyIn0.SNVMR4If68Af3tEJ60o9oEF91bDkO8XDFwRGmyRAcmg	2026-03-25 15:16:50.783779+00	2026-04-01 15:16:50+00	2	5b74383a00ab482bb2492037a29c1257
148	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA2MDIxNCwiaWF0IjoxNzc0NDU1NDE0LCJqdGkiOiJhYzU0YTlhODliMDg0ZjVhOWY5NzI3ZGFlNjI2MjM3ZSIsInVzZXJfaWQiOiIyIn0.rp8tl4Rx53D5_ku1L6JPmxlgura-mjikJk42r04n1Ds	2026-03-25 16:16:54.847674+00	2026-04-01 16:16:54+00	2	ac54a9a89b084f5a9f9727dae626237e
149	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA2MDM0NSwiaWF0IjoxNzc0NDU1NTQ1LCJqdGkiOiIwMzc3NjQ3ZjAwZjc0ZGU3OTgwMWExMzg3NTY3ZmM4NSIsInVzZXJfaWQiOiIyIn0.JhRnFbh135IQjV17R-WLw33NiYJfdnDYA4G_C2Wa4bU	2026-03-25 16:19:05.074119+00	2026-04-01 16:19:05+00	2	0377647f00f74de79801a1387567fc85
150	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3MTA5MCwiaWF0IjoxNzc0NDY2MjkwLCJqdGkiOiI4YmNiNTVhOTNiMDI0ZGRlOGNjZWYxMTIzZjAxMTIwMCIsInVzZXJfaWQiOiIyIn0.d4zXJcU2SU16QnTwdHd-ky2Qkq3MdVruDlYOyqob0Rk	2026-03-25 19:18:10.650533+00	2026-04-01 19:18:10+00	2	8bcb55a93b024dde8ccef1123f011200
151	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3MTA5MCwiaWF0IjoxNzc0NDY2MjkwLCJqdGkiOiI2MjZhNmQ1NmMwMjI0Nzc5OTFlNWRlNjI3ZTRmOTU3OCIsInVzZXJfaWQiOiIyIn0.SRVZmdNx2IG68MV1TXN4L5-z1oJLmz4TZ4UKjClvM_c	2026-03-25 19:18:10.664415+00	2026-04-01 19:18:10+00	2	626a6d56c022477991e5de627e4f9578
152	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3MTA5MCwiaWF0IjoxNzc0NDY2MjkwLCJqdGkiOiIxM2VlN2E2MzA3MTM0ZTA1YWYzNWYxNTkwZDc0YTdkOCIsInVzZXJfaWQiOiIyIn0.Kw4msJI5gK3AxVvOuLGOQJfSXfrihrzsVLouwD8Rblc	2026-03-25 19:18:10.637208+00	2026-04-01 19:18:10+00	2	13ee7a6307134e05af35f1590d74a7d8
153	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3MTEwMCwiaWF0IjoxNzc0NDY2MzAwLCJqdGkiOiI3NTUzYWFmYzg5YTk0NDkyYWZlZjcwZDZjYTkzNGI2ZiIsInVzZXJfaWQiOiIyIn0.uhfnT2ozDwnymhwde9L6NwzAgKLL-lf5XChAlI0HiB4	2026-03-25 19:18:20.041398+00	2026-04-01 19:18:20+00	2	7553aafc89a94492afef70d6ca934b6f
154	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3MjkwOCwiaWF0IjoxNzc0NDY4MTA4LCJqdGkiOiI5N2RiN2U2Zjc0NGQ0NWNkYjIyNmM1M2EwNmFmODM3MyIsInVzZXJfaWQiOiIyIn0.aiP3xvOk0J467ps7PhWMWtQqsmeDW6yilL6W4Aucz1s	2026-03-25 19:48:28.739142+00	2026-04-01 19:48:28+00	2	97db7e6f744d45cdb226c53a06af8373
155	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3NDcyNCwiaWF0IjoxNzc0NDY5OTI0LCJqdGkiOiI4MmFkOWM3MmJkN2E0OGNlOGU5Y2NiNzU3MWE2N2FkZSIsInVzZXJfaWQiOiIyIn0.oILLUBampdWNpffwMvKqg0qAlpj6jaDtOm695qok7fM	2026-03-25 20:18:44.528398+00	2026-04-01 20:18:44+00	2	82ad9c72bd7a48ce8e9ccb7571a67ade
156	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3NzExMywiaWF0IjoxNzc0NDcyMzEzLCJqdGkiOiI1YjRhNmM4ZDQwYjA0ZjU4YmM5YWQ5MmU2NGUyM2Q4YyIsInVzZXJfaWQiOiIyIn0.0CdNiahHTlcqyRd85DfpALj7SYPetl8gDqYuair_vjI	2026-03-25 20:58:33.331927+00	2026-04-01 20:58:33+00	2	5b4a6c8d40b04f58bc9ad92e64e23d8c
157	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3OTQ3NSwiaWF0IjoxNzc0NDc0Njc1LCJqdGkiOiJiZTA0MDY0ZmY4NDM0MmIyYjk3OWZiOTNiNWEzZTg5NCIsInVzZXJfaWQiOiIyIn0.NKKaAAZO8oQqTYBuGTYb92e7XFptnwcH1b7xv5OBdMk	2026-03-25 21:37:55.61719+00	2026-04-01 21:37:55+00	2	be04064ff84342b2b979fb93b5a3e894
158	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA3OTQ4MiwiaWF0IjoxNzc0NDc0NjgyLCJqdGkiOiI0OGUwNWU3ZDlkOTA0M2U1YmNhNDY1N2MyZTBhNTM4MSIsInVzZXJfaWQiOiIyIn0.Ht1JIpHgLRS4N0JtO9FloGmn92x-r0RenfuT5aXwQAo	2026-03-25 21:38:02.29092+00	2026-04-01 21:38:02+00	2	48e05e7d9d9043e5bca4657c2e0a5381
159	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4MTc3NSwiaWF0IjoxNzc0NDc2OTc1LCJqdGkiOiJiN2EwZTIxMGZiNTk0YzRjYmE2ZGRmZjBiNjRiZGE5NSIsInVzZXJfaWQiOiIyIn0._L2SaeKNgVRWjpmoXt12C-ULBRM39lzAYkdBlQtZt8k	2026-03-25 22:16:15.455006+00	2026-04-01 22:16:15+00	2	b7a0e210fb594c4cba6ddff0b64bda95
160	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4Mzg0OSwiaWF0IjoxNzc0NDc5MDQ5LCJqdGkiOiI0YjVhNDViYzY3MWY0NGIyYjE1NWZiZDAyYThlMjc5ZSIsInVzZXJfaWQiOiIyIn0.E6NwKlP6dSM3ZpZ-MsAFhCtVBEClkyhUWtOfPiu0XjA	2026-03-25 22:50:49.193674+00	2026-04-01 22:50:49+00	2	4b5a45bc671f44b2b155fbd02a8e279e
161	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4Mzg1NCwiaWF0IjoxNzc0NDc5MDU0LCJqdGkiOiIxMjAwMTBkYzNjNjg0NzM2OTJmMTM3YWJhNTcwMmM4YSIsInVzZXJfaWQiOiIyIn0.lfkpuzLVaU6Cb4sagejV-DhLqxcXvzgBn9fFzdarU1c	2026-03-25 22:50:54.260966+00	2026-04-01 22:50:54+00	2	120010dc3c68473692f137aba5702c8a
163	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4NzEwOSwiaWF0IjoxNzc0NDgyMzA5LCJqdGkiOiJhOGM3Y2Y5ZDk4MDQ0MjNiODIxNmRmMmY2Y2VhYzhmZSIsInVzZXJfaWQiOiIyIn0.-q81DOTazu0j500OBtoTWk4ZExDvw5nRPgpv7ACfJ7E	2026-03-25 23:45:09.603274+00	2026-04-01 23:45:09+00	2	a8c7cf9d9804423b8216df2f6ceac8fe
164	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4NzEwOSwiaWF0IjoxNzc0NDgyMzA5LCJqdGkiOiJjZDMzYmYwNTkzNmU0NWQzYjhjZDgxZTEwYTQ5NGE0NyIsInVzZXJfaWQiOiIyIn0.AWLJeyHNdm8607vbyY7wnDLULdji3ZgB_8k99CXgsOU	2026-03-25 23:45:09.595645+00	2026-04-01 23:45:09+00	2	cd33bf05936e45d3b8cd81e10a494a47
162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4NzEwOSwiaWF0IjoxNzc0NDgyMzA5LCJqdGkiOiI2YmNlZjE5ZWM1ZGY0ZjkwODBmZjU2ODkzZTBiYmJhYSIsInVzZXJfaWQiOiIyIn0.nYdLdOs0v8A-QopTB5bPTjrOj4ycdhxyBSh_I2KBKxU	2026-03-25 23:45:09.574597+00	2026-04-01 23:45:09+00	2	6bcef19ec5df4f9080ff56893e0bbbaa
165	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4NzE0MSwiaWF0IjoxNzc0NDgyMzQxLCJqdGkiOiIyODYxZmU3YzBlODE0YmI1OWU4MjFmZjY1YTU2MTIxNiIsInVzZXJfaWQiOiIyIn0.DS-Di9EghAZMTaLZV8QgCwH05WMSYeUkKQSFRUkJN7c	2026-03-25 23:45:41.636353+00	2026-04-01 23:45:41+00	2	2861fe7c0e814bb59e821ff65a561216
166	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA4ODk0NSwiaWF0IjoxNzc0NDg0MTQ1LCJqdGkiOiI2NjVjOGNmMGQzZjc0YjAyYjlmNGIzZGRiYmQ4YTk5MiIsInVzZXJfaWQiOiIyIn0.h4S-OoLvaLT5KB7Fnns-a3TETBXvt_Dx_xmr8zC6614	2026-03-26 00:15:45.250572+00	2026-04-02 00:15:45+00	2	665c8cf0d3f74b02b9f4b3ddbbd8a992
167	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5MTIzNywiaWF0IjoxNzc0NDg2NDM3LCJqdGkiOiI5NjM5NjBkYzY5ODA0NzAzOGRjN2Y1ZmU1MmM5MzIwMiIsInVzZXJfaWQiOiIyIn0.tyd4Dtzjg87Rp2IbIOVCQ_Be38L3LNbyqRtKNdvhtOM	2026-03-26 00:53:57.75784+00	2026-04-02 00:53:57+00	2	963960dc698047038dc7f5fe52c93202
168	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5MTI0NywiaWF0IjoxNzc0NDg2NDQ3LCJqdGkiOiI4ZGJjYzFiMjViYmM0M2U4YWUwOWExOGY4NmM1M2EyMSIsInVzZXJfaWQiOiIyIn0.AApvs7ggJWqt3vdjeRowXfCWZ6__JR7vE5CsN5FsTZ0	2026-03-26 00:54:07.631263+00	2026-04-02 00:54:07+00	2	8dbcc1b25bbc43e8ae09a18f86c53a21
169	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5MzI5OSwiaWF0IjoxNzc0NDg4NDk5LCJqdGkiOiI3YTdhNDkyZWQ3NTU0ZjdmOWVhZWUxMDJkNzQ4NTlkOCIsInVzZXJfaWQiOiIyIn0.eKddDUuVu41paayqx4kWM5wqzHXKDpe_yB0zKAYPfsU	2026-03-26 01:28:19.95305+00	2026-04-02 01:28:19+00	2	7a7a492ed7554f7f9eaee102d74859d8
170	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5MzMwNSwiaWF0IjoxNzc0NDg4NTA1LCJqdGkiOiJjOTYwNzkyODYwY2U0NjBjYWE0NDUxZDk5ZDg2YTRiYiIsInVzZXJfaWQiOiIyIn0.o2tthjCrt8psDUH2-r7HF3gSvkg2750Sgg4HtRejP7g	2026-03-26 01:28:25.803897+00	2026-04-02 01:28:25+00	2	c960792860ce460caa4451d99d86a4bb
171	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5NTYwNiwiaWF0IjoxNzc0NDkwODA2LCJqdGkiOiJmNGJhZTNmNTllNGU0YmRiYjY2NjI4NDlhODc0N2NlOCIsInVzZXJfaWQiOiIyIn0.H2UaV2bB1SmjzvWAHnUAKL_9okM0rD0RxfWvyw4O9Lg	2026-03-26 02:06:46.493057+00	2026-04-02 02:06:46+00	2	f4bae3f59e4e4bdbb6662849a8747ce8
172	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5NzQzNiwiaWF0IjoxNzc0NDkyNjM2LCJqdGkiOiJiZjYzOGE3ZDAyMGE0ZWQ4OGI4ZGM5NTMyOWEwNGU4MiIsInVzZXJfaWQiOiIyIn0.wvNLPg4fEd2jVT7v4H0VqGqmYyBzg_9PVRWAA2DvTks	2026-03-26 02:37:16.436681+00	2026-04-02 02:37:16+00	2	bf638a7d020a4ed88b8dc95329a04e82
173	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5NzQ0MiwiaWF0IjoxNzc0NDkyNjQyLCJqdGkiOiIzZTA0NDJlNTU3ZmE0MWY5OTc2ZWJmNTZlYjljZmMzMiIsInVzZXJfaWQiOiIyIn0.rIM0iVkGH95WfeTXNttoisxpc34sg3mXPYhOrkMAuaQ	2026-03-26 02:37:22.274358+00	2026-04-02 02:37:22+00	2	3e0442e557fa41f9976ebf56eb9cfc32
174	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA5OTYxMiwiaWF0IjoxNzc0NDk0ODEyLCJqdGkiOiIxMDQ2NzJjYTA1ODM0NGJhYjIxZTUzOGNlNWJlZDI0YSIsInVzZXJfaWQiOiIyIn0.WblUWuVm6UrhCUCnck4oq9Yfwr36BXsuByxg2wZNWq4	2026-03-26 03:13:32.836204+00	2026-04-02 03:13:32+00	2	104672ca058344bab21e538ce5bed24a
175	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE0MjI1NCwiaWF0IjoxNzc0NTM3NDU0LCJqdGkiOiJmNDQ2Yjk4NjQxYzE0N2IxYTMwZDc3NTJmZmNmNGE3NSIsInVzZXJfaWQiOiIyIn0.KIk5PUClO74Xvc16yFxwSi6WiXUEXeEKN97erDwyoGA	2026-03-26 15:04:14.781494+00	2026-04-02 15:04:14+00	2	f446b98641c147b1a30d7752ffcf4a75
176	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE0NDExNCwiaWF0IjoxNzc0NTM5MzE0LCJqdGkiOiI5NTJiYWY1NGUwNTk0NWM3YmMwMjY1YmJhYzVlYzFmMCIsInVzZXJfaWQiOiIyIn0.sE9E-dzkaxzHNFuXiz-eX88QLBOT7fuEv_2l7SIOw5U	2026-03-26 15:35:14.600256+00	2026-04-02 15:35:14+00	2	952baf54e05945c7bc0265bbac5ec1f0
177	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE0NzM3MCwiaWF0IjoxNzc0NTQyNTcwLCJqdGkiOiJkYTY0M2NkODAwYTI0MTkxYWViOGUyNDBmZjUzZjRiMiIsInVzZXJfaWQiOiIyIn0.O864wur6ws-_gNIYcIvhGxhnR7v9wQbKPNMCnJqisec	2026-03-26 16:29:30.545186+00	2026-04-02 16:29:30+00	2	da643cd800a24191aeb8e240ff53f4b2
178	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE0OTIwOSwiaWF0IjoxNzc0NTQ0NDA5LCJqdGkiOiJjYjhjNDZiNmRjNGI0MmE5YjkyMWE0MTY2YzUxNDIyMSIsInVzZXJfaWQiOiIyIn0.PTVMDkbVpBq6HYJ7Y5ijgWJfBfzK6b5mNd0cKZmZnHE	2026-03-26 17:00:09.93936+00	2026-04-02 17:00:09+00	2	cb8c46b6dc4b42a9b921a4166c514221
179	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE1OTQ4NCwiaWF0IjoxNzc0NTU0Njg0LCJqdGkiOiJjOGI3ZmRlODQxNTc0YzczODQ0YmVmMjc1NmQ1M2Y5NCIsInVzZXJfaWQiOiIyIn0.IbFAkQXVMseHCYFGNvmRxGp_mlHWbKXJYX86xQhJadw	2026-03-26 19:51:24.300854+00	2026-04-02 19:51:24+00	2	c8b7fde841574c73844bef2756d53f94
180	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE2MTcxMCwiaWF0IjoxNzc0NTU2OTEwLCJqdGkiOiI4YTUxNzg4OWU2Nzc0NmEzYmNmNjJkMjRkMDRlNTEyMyIsInVzZXJfaWQiOiIyIn0.tPBVuXuBLlroUWneGaZJoAQOe-SDY-Fa5RA7N7zJkC0	2026-03-26 20:28:30.552894+00	2026-04-02 20:28:30+00	2	8a517889e67746a3bcf62d24d04e5123
181	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE2MzU5NSwiaWF0IjoxNzc0NTU4Nzk1LCJqdGkiOiJkYjY5YmY3MTQ1Yjg0MGNiYjZhYTlhMmFjOTkzMTBjYSIsInVzZXJfaWQiOiIyIn0.wNwcWM8BrT9Q5otC9li98F1Cwzn26YR0e8LkOPihJLs	2026-03-26 20:59:55.285925+00	2026-04-02 20:59:55+00	2	db69bf7145b840cbb6aa9a2ac99310ca
182	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE2NTc4NywiaWF0IjoxNzc0NTYwOTg3LCJqdGkiOiJiNTU1YjkxYjJiMzg0ZjVhOTM1YjNiYTgyM2M0NjRhYyIsInVzZXJfaWQiOiIyIn0.7iqivJrPSWfK5vt89klrFSpvc-0EumP24K3WrSoZwwE	2026-03-26 21:36:27.076841+00	2026-04-02 21:36:27+00	2	b555b91b2b384f5a935b3ba823c464ac
183	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE2Nzc3OCwiaWF0IjoxNzc0NTYyOTc4LCJqdGkiOiI3ZTIzYTRkZTlhNmE0M2VhYjc3Yjc2ODlmZTBiMDFlNSIsInVzZXJfaWQiOiIyIn0.k2iuX_44Jjp0ZnV9Ro_ZxaZtdnLR89tG7x238Hh_Ev0	2026-03-26 22:09:38.273577+00	2026-04-02 22:09:38+00	2	7e23a4de9a6a43eab77b7689fe0b01e5
184	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3MDIzMSwiaWF0IjoxNzc0NTY1NDMxLCJqdGkiOiJiNTc0NzMzMDI5NzY0OGI2YmEyZjFiOGQ0NjBiZjM3OSIsInVzZXJfaWQiOiIyIn0.3Rb2LxIdY8LH25TfziqzmRoFfwVLF37TvWI9DdoY6mU	2026-03-26 22:50:31.774896+00	2026-04-02 22:50:31+00	2	b5747330297648b6ba2f1b8d460bf379
185	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3MjAzNywiaWF0IjoxNzc0NTY3MjM3LCJqdGkiOiI2MGE5MjYxMDgxZjE0N2UzOGNjYTdmMTk0MmRjYjdmMCIsInVzZXJfaWQiOiIyIn0.LvaYTu7_aLKFz1-dgCrzPH2h6txbtMmMGJOexmLHM_w	2026-03-26 23:20:37.422155+00	2026-04-02 23:20:37+00	2	60a9261081f147e38cca7f1942dcb7f0
186	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3Mzg0NywiaWF0IjoxNzc0NTY5MDQ3LCJqdGkiOiI5YWJiMDZhNGQ4Yjk0ZTM4YmZhMGRlYzNiY2ExYmIyZCIsInVzZXJfaWQiOiIyIn0.Xp2Bp7NUb0XvQReeiT3-eCsyGQ_ACCFn12UoIfpROGg	2026-03-26 23:50:47.694918+00	2026-04-02 23:50:47+00	2	9abb06a4d8b94e38bfa0dec3bca1bb2d
187	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3NTY1MiwiaWF0IjoxNzc0NTcwODUyLCJqdGkiOiIwNzk5MzQ0NzY3OGM0ZWM0ODYwNGM5NTMzODRhODAwYSIsInVzZXJfaWQiOiIyIn0.isOTH4mlVoyl_sJ7tpNVnB5c7a9rjJQr44vXYerI6-s	2026-03-27 00:20:52.633985+00	2026-04-03 00:20:52+00	2	07993447678c4ec48604c953384a800a
188	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3NzUwNCwiaWF0IjoxNzc0NTcyNzA0LCJqdGkiOiIwMjViOTc1YmI5YjA0N2Y0ODlhODJhYzEwMzVkMTg0MyIsInVzZXJfaWQiOiIyIn0.R703fYA8HKTwNfUaforX-p8BrfK6Mo-MYm4SCpMQVdc	2026-03-27 00:51:44.129514+00	2026-04-03 00:51:44+00	2	025b975bb9b047f489a82ac1035d1843
189	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3OTc5OSwiaWF0IjoxNzc0NTc0OTk5LCJqdGkiOiJkYjZlYWEyOTdjYTA0Mjg3OWMzMTlmMzQ2MjZiOWVkMiIsInVzZXJfaWQiOiIyIn0.nmD3V6DC_BTHfsVORFoQ7e4CwlW0cDdCrPaThKA8Khw	2026-03-27 01:29:59.249732+00	2026-04-03 01:29:59+00	2	db6eaa297ca042879c319f34626b9ed2
190	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE3OTgwNiwiaWF0IjoxNzc0NTc1MDA2LCJqdGkiOiJiMTA4N2Y3ODQ1NzU0YjEyOWVjMzdjM2JjNzcyN2M1OCIsInVzZXJfaWQiOiIyIn0.L4DXc6f_FY6twD4Dd-d3_IDnzLRveyW-zH4GNFWP5Bo	2026-03-27 01:30:06.462594+00	2026-04-03 01:30:06+00	2	b1087f7845754b129ec37c3bc7727c58
191	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTIxODAwNSwiaWF0IjoxNzc0NjEzMjA1LCJqdGkiOiI5YmJlZGNlNDdmNTg0ZTQ3YjY5OTNmNTcwYzUxNTI0NSIsInVzZXJfaWQiOiIyIn0.uXZF5wj3FCAIeKeyCnDq_E8LCbbrQEIovy4dU9om-mw	2026-03-27 12:06:45.813476+00	2026-04-03 12:06:45+00	2	9bbedce47f584e47b6993f570c515245
192	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTIxODE1NSwiaWF0IjoxNzc0NjEzMzU1LCJqdGkiOiJkOTMyOGVlMTliZDQ0Njc5YWViMWFmOTE4M2I0ZTY0ZSIsInVzZXJfaWQiOiIyIn0.s3vTt2x60GdfbDF_F9fqAppolE3T5ME26a5MVeepNAA	2026-03-27 12:09:15.178068+00	2026-04-03 12:09:15+00	2	d9328ee19bd44679aeb1af9183b4e64e
193	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTIyMDQ2MiwiaWF0IjoxNzc0NjE1NjYyLCJqdGkiOiI2M2QxMmQ0YTBmYmM0YWMzOGZlNDU1NTI3MWY5Y2RmNiIsInVzZXJfaWQiOiIyIn0.q9HX9uBBizp_z5olh52ERudRT06_vnp3GVIW4C8xLXc	2026-03-27 12:47:42.639629+00	2026-04-03 12:47:42+00	2	63d12d4a0fbc4ac38fe4555271f9cdf6
194	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTIzNzYyOSwiaWF0IjoxNzc0NjMyODI5LCJqdGkiOiJlMmMyODczNmJkNjg0MGRmYWJkNzVkMjIwYjRkYTkwZSIsInVzZXJfaWQiOiIyIn0.cgyuQvOkDSagcGlChpJ-fT5LLrAbNiDtX-ezt9C0jTE	2026-03-27 17:33:49.461303+00	2026-04-03 17:33:49+00	2	e2c28736bd6840dfabd75d220b4da90e
195	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTIzOTU1MywiaWF0IjoxNzc0NjM0NzUzLCJqdGkiOiIyYjYyYjA0MGUzYjQ0NjY4YTYzMDUyODc1OTgzMDVmMiIsInVzZXJfaWQiOiIyIn0.IzlFOEHaPstbAbvG2heuuCdSMP0bnQWi5gAor6uTcUI	2026-03-27 18:05:53.234407+00	2026-04-03 18:05:53+00	2	2b62b040e3b44668a6305287598305f2
196	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI0MTM2MiwiaWF0IjoxNzc0NjM2NTYyLCJqdGkiOiJhNDMzN2JiZmU0NmM0MDJhYWNhN2Y1MWM1YmY5NjUyYiIsInVzZXJfaWQiOiIyIn0.3qa5lIyTiMSjEiyuPS0fhUoX6vnMCQHyWoiUU3MVzpo	2026-03-27 18:36:02.052883+00	2026-04-03 18:36:02+00	2	a4337bbfe46c402aaca7f51c5bf9652b
197	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI0MzE2OCwiaWF0IjoxNzc0NjM4MzY4LCJqdGkiOiI5ZjY3NmJkMjg5NmY0ZTQwOGQxMzFjZTI3ZjI3ZjEzMCIsInVzZXJfaWQiOiIyIn0.ej9VKUp01-BbrkQS915R57itkPNywbpP9w7eYyhOjXY	2026-03-27 19:06:08.819024+00	2026-04-03 19:06:08+00	2	9f676bd2896f4e408d131ce27f27f130
198	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI0NjkyOSwiaWF0IjoxNzc0NjQyMTI5LCJqdGkiOiJhMzYxNWRjYzE3MGY0M2I1OGRlOWE2ZjlhODYxZDJlZiIsInVzZXJfaWQiOiIyIn0.Lfit4kVlVmcpSJUE-bFNx-HTBDPGIWZRki6SutvPL8k	2026-03-27 20:08:49.987063+00	2026-04-03 20:08:49+00	2	a3615dcc170f43b58de9a6f9a861d2ef
199	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI0Njk0MiwiaWF0IjoxNzc0NjQyMTQyLCJqdGkiOiI2ZmQyMDVmYTY3YTI0ZDgyYmRkYjI5NmQ4YjE0ZTNiYSIsInVzZXJfaWQiOiIyIn0.44u94lHLlhfdSGvWwxIOATTlmQSnad2RaebNr2W5uKA	2026-03-27 20:09:02.834042+00	2026-04-03 20:09:02+00	2	6fd205fa67a24d82bddb296d8b14e3ba
200	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI0ODg3MSwiaWF0IjoxNzc0NjQ0MDcxLCJqdGkiOiJlNzdjNmQ1NjM4Mjg0MzZmOTg1OGM1NGE4MGNjODYxNSIsInVzZXJfaWQiOiIyIn0.IRy0Yp67XSipYfS7W3Sy13nfoKJzT1rFYZ2OSlqeEU0	2026-03-27 20:41:11.160884+00	2026-04-03 20:41:11+00	2	e77c6d563828436f9858c54a80cc8615
201	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI1NzQzNiwiaWF0IjoxNzc0NjUyNjM2LCJqdGkiOiJmNzg4NzI2ODMyNjg0YzVjOWM4YmQwMzJhYzJiYThmZiIsInVzZXJfaWQiOiIyIn0.Gcv5c7aD2fI-U1kMylVUbr-ki7R3EuwyQhZbFUD3ZaU	2026-03-27 23:03:56.925207+00	2026-04-03 23:03:56+00	2	f788726832684c5c9c8bd032ac2ba8ff
202	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI1OTgwNiwiaWF0IjoxNzc0NjU1MDA2LCJqdGkiOiI1YjI2NzdiOWJlYjY0ZDQxYWM4MTYyNWIyYThhNzg5YiIsInVzZXJfaWQiOiIyIn0.A9VFXn3d3hmgZ-AQ_1fXtNL4OhL6fdfwPaO0ojcj3HQ	2026-03-27 23:43:26.471886+00	2026-04-03 23:43:26+00	2	5b2677b9beb64d41ac81625b2a8a789b
203	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI1OTgxNiwiaWF0IjoxNzc0NjU1MDE2LCJqdGkiOiIxMjhmOWEwZDg0MWE0YmRkODgwNDBkZjE1ZTlhZDJlYiIsInVzZXJfaWQiOiIyIn0.oOxdsoN_5RJAE7vgX86g8Il0r5kIvraUQuh8EKhv8N0	2026-03-27 23:43:36.118629+00	2026-04-03 23:43:36+00	2	128f9a0d841a4bdd88040df15e9ad2eb
204	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI2NjI1OCwiaWF0IjoxNzc0NjYxNDU4LCJqdGkiOiIxYTc1ODVhNTAwODA0NDY0YTYxYmE3Zjk1ZmNjZGY3NSIsInVzZXJfaWQiOiIyIn0.UDs0gXarr2TTadntnkJ-kF84k4gIbquPomenwf-rUPE	2026-03-28 01:30:58.200294+00	2026-04-04 01:30:58+00	2	1a7585a500804464a61ba7f95fccdf75
205	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI2ODExOSwiaWF0IjoxNzc0NjYzMzE5LCJqdGkiOiI3NTU4YTA0ODljMWU0NzcyODVkZGE5NzJmNDBlM2RjMCIsInVzZXJfaWQiOiIyIn0.3IqdStzm5BNRNJB7VqJveJzS_XnNCxzOibOrw2drr-g	2026-03-28 02:01:59.512795+00	2026-04-04 02:01:59+00	2	7558a0489c1e477285dda972f40e3dc0
206	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTMwODYxMSwiaWF0IjoxNzc0NzAzODExLCJqdGkiOiJkNDgwMzRkMDA4ZWM0OTRiYjZhNmQ5NTIyOTYwZGE2ZiIsInVzZXJfaWQiOiIyIn0.MK7r8ga7nHQWjy7qRC3U1BfB-xig8GQLM9EEWom1n1w	2026-03-28 13:16:51.056083+00	2026-04-04 13:16:51+00	2	d48034d008ec494bb6a6d9522960da6f
207	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTMxMTUzMiwiaWF0IjoxNzc0NzA2NzMyLCJqdGkiOiI1M2ZmZjZiOTVjNDg0MmZiYTkxZWI0Y2JlMzU3MjZlNiIsInVzZXJfaWQiOiIyIn0.OYvbr1-92LEDwnHiFKB_IRbwfpXelavg1pabJR_f2Tg	2026-03-28 14:05:32.26794+00	2026-04-04 14:05:32+00	2	53fff6b95c4842fba91eb4cbe35726e6
208	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTMxMTUzMywiaWF0IjoxNzc0NzA2NzMzLCJqdGkiOiI0MTNjNTllNzg4NmU0OGViYTIxOTRkNDRiNDFhMTUwOSIsInVzZXJfaWQiOiIyIn0.vByoHu0qyfsj_BTTBLE_Grt_6OfEZo9bU5thNZCu4t8	2026-03-28 14:05:33.784911+00	2026-04-04 14:05:33+00	2	413c59e7886e48eba2194d44b41a1509
209	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTMxMzMzNywiaWF0IjoxNzc0NzA4NTM3LCJqdGkiOiJkZjBjN2ViOWZjY2U0ZWI1OGFhNWUwOTI2YThhYzU2NyIsInVzZXJfaWQiOiIyIn0.dJxS6PyLrGXfm4CxIYkMO5r4shthLXNwWzS8MwkIcjQ	2026-03-28 14:35:37.55936+00	2026-04-04 14:35:37+00	2	df0c7eb9fcce4eb58aa5e0926a8ac567
210	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQwMDk3OSwiaWF0IjoxNzc0Nzk2MTc5LCJqdGkiOiIyN2IzMTA2YTY3ODY0MWQ5OWQ1NjAwMjdlMDhmMWEwYSIsInVzZXJfaWQiOiIyIn0.Q7PmaNiQbQlaa-m1Ob4JsTebgBu9HqpkY28CrStdfoc	2026-03-29 14:56:19.377352+00	2026-04-05 14:56:19+00	2	27b3106a678641d99d560027e08f1a0a
211	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQwMjcxMiwiaWF0IjoxNzc0Nzk3OTEyLCJqdGkiOiJlMmM2MDQ0M2JmZGI0NDdiODk0MGI3ZWUzNTAyYWExZSIsInVzZXJfaWQiOiIyIn0.WhIIHpuADAhtUwhsZkrIAGjw2aIAvl95nvWkgyaRaZA	2026-03-29 15:25:12.249534+00	2026-04-05 15:25:12+00	2	e2c60443bfdb447b8940b7ee3502aa1e
212	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQwNDkyOCwiaWF0IjoxNzc0ODAwMTI4LCJqdGkiOiJlYzdjNWZhNjY1YmQ0YTdiODAxOGUyZjdmYmE4MjM3NiIsInVzZXJfaWQiOiIyIn0.p3kKPwV19pgDE0CjSJrXVZ6O3Dfv1npHSVNEQ9LoLw8	2026-03-29 16:02:08.730675+00	2026-04-05 16:02:08+00	2	ec7c5fa665bd4a7b8018e2f7fba82376
213	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQwODc0MCwiaWF0IjoxNzc0ODAzOTQwLCJqdGkiOiI5OTFmNDAxNTZhOTU0NGFjODZmY2QzNzQ4N2Q5MDE3OSIsInVzZXJfaWQiOiIyIn0.DtYolZtZPUG4rPXuz_A0tGvRgdRsZC0I-yIlJVi2QNM	2026-03-29 17:05:40.628294+00	2026-04-05 17:05:40+00	2	991f40156a9544ac86fcd37487d90179
214	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxMjg1NCwiaWF0IjoxNzc0ODA4MDU0LCJqdGkiOiJhMzdiOTQ1YzFiYjA0Zjc1YWI0M2I4ZDkzNTUwN2JjMSIsInVzZXJfaWQiOiIyIn0.8JXN96zEF8LG6AEQrx6Z-Th-qCprC1z2NFpuut3gAwM	2026-03-29 18:14:14.947801+00	2026-04-05 18:14:14+00	2	a37b945c1bb04f75ab43b8d935507bc1
215	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNDY1NCwiaWF0IjoxNzc0ODA5ODU0LCJqdGkiOiI1YWM1NTQ3OTg5YWY0OWM0OTc5N2ZkNzJmNjBhMWNkMyIsInVzZXJfaWQiOiIyIn0.gmwLzEp01_qnvzj6RJr0j4olrwQjne2yBybkrsJf0FM	2026-03-29 18:44:14.782727+00	2026-04-05 18:44:14+00	2	5ac5547989af49c49797fd72f60a1cd3
216	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNTQzOSwiaWF0IjoxNzc0ODEwNjM5LCJqdGkiOiI5ODI1ODQ2MjUyNzA0YjZkOTJkYzViOTg0MGY1NTRjYiIsInVzZXJfaWQiOiIyIn0.m8u4vZfMix-W03EYA0ihQrwyUS-D7O0HlbOLJePs8Lo	2026-03-29 18:57:19.167735+00	2026-04-05 18:57:19+00	2	9825846252704b6d92dc5b9840f554cb
217	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQyMDI0NiwiaWF0IjoxNzc0ODE1NDQ2LCJqdGkiOiI3YmEzOTgxNzgzOTA0ZmU5YjNhYzAzMzVhYjZkZGE1NiIsInVzZXJfaWQiOiIyIn0.odl5irVkRxrnE9jIe6hFMJZuNCDVovC11p9JSB9AkuQ	2026-03-29 20:17:26.640026+00	2026-04-05 20:17:26+00	2	7ba3981783904fe9b3ac0335ab6dda56
218	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQzMTI4MSwiaWF0IjoxNzc0ODI2NDgxLCJqdGkiOiI0ZGEzNDc1OGRjMjY0NjNmOTIwOWUyYzJlZmM5ODRhNCIsInVzZXJfaWQiOiIyIn0.JEb5RD4nwN8PXM262MB7AaUIiCDNXV52B0EGXx-KRMI	2026-03-29 23:21:21.909397+00	2026-04-05 23:21:21+00	2	4da34758dc26463f9209e2c2efc984a4
219	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQzMTI4MSwiaWF0IjoxNzc0ODI2NDgxLCJqdGkiOiIzYmJmNTBiNjUyZDk0NGNmYWIwYWRiMTY1YTQyMmUxNyIsInVzZXJfaWQiOiIyIn0.HhZbac_6Qjb3CvU-CYPdwhOCxeCQ3k3AMEZPIPt16Gg	2026-03-29 23:21:21.876565+00	2026-04-05 23:21:21+00	2	3bbf50b652d944cfab0adb165a422e17
220	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQzMzIxNSwiaWF0IjoxNzc0ODI4NDE1LCJqdGkiOiJiNzI5OGM5Y2E5ZGE0MzczOWY5ZDExN2JjZDNiMjZmNyIsInVzZXJfaWQiOiIyIn0.DhXxYAaum6KYkBaQyufI_V417dRuRZrTImIXbMAv2Qg	2026-03-29 23:53:35.01705+00	2026-04-05 23:53:35+00	2	b7298c9ca9da43739f9d117bcd3b26f7
221	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQzNTAxNSwiaWF0IjoxNzc0ODMwMjE1LCJqdGkiOiJlZWQ0MTYwMTNhMDU0NDIwOTdmZjU0YmQ5NmU4YjVlZSIsInVzZXJfaWQiOiIyIn0.LaD-8JsqpAU8NkdFouPvAxd_D5tA_wwWASuhAkZ9VCw	2026-03-30 00:23:35.487043+00	2026-04-06 00:23:35+00	2	eed416013a05442097ff54bd96e8b5ee
222	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ3NjgyNSwiaWF0IjoxNzc0ODcyMDI1LCJqdGkiOiJlM2I5Y2I0YjVlYWY0NDMxOTk4ZWRjZTU1ZTM3ODc1NiIsInVzZXJfaWQiOiIyIn0.eEdX6zA_UqqLkyIlCJcs-jgUT0JkGQ8cuvCqaPjRsvE	2026-03-30 12:00:25.215553+00	2026-04-06 12:00:25+00	2	e3b9cb4b5eaf4431998edce55e378756
223	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ3NzQ3MywiaWF0IjoxNzc0ODcyNjczLCJqdGkiOiJmYTcwMzk3Nzg2MGE0NDgyYjhjMmRmYzY5NDQyNmQzOCIsInVzZXJfaWQiOiIyIn0.fRzBTFa3v012j3T332241aecv5pM1vxUVqO9nobf70M	2026-03-30 12:11:13.805826+00	2026-04-06 12:11:13+00	2	fa703977860a4482b8c2dfc694426d38
224	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ3NzQ5NiwiaWF0IjoxNzc0ODcyNjk2LCJqdGkiOiIyODBmMGM4NTNhYzY0OWFkYTc1NzU3MmFmNjk1NTgwNSIsInVzZXJfaWQiOiIyIn0.VP1TAnQc9IGaW3_3WMrfgKJK8FjB3tKvklt0o33yp1w	2026-03-30 12:11:36.633874+00	2026-04-06 12:11:36+00	2	280f0c853ac649ada757572af6955805
225	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ3Nzk5MCwiaWF0IjoxNzc0ODczMTkwLCJqdGkiOiI5YzRjZDFmZGEzOTY0NGRjOGYzYWU5MGU5NmVkMmIzYyIsInVzZXJfaWQiOiIyIn0.Wxj2M0MDaM0D9F_ROY0GZbBTim0_MVo8JQGz52lNIlU	2026-03-30 12:19:50.184232+00	2026-04-06 12:19:50+00	2	9c4cd1fda39644dc8f3ae90e96ed2b3c
226	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ3ODAxOSwiaWF0IjoxNzc0ODczMjE5LCJqdGkiOiIzMWE3MzQ2MWNhZGE0ODExODdkNDQ4YjlkNDhlOTk2YyIsInVzZXJfaWQiOiIyIn0.lKuCThHiaH4q07ZBiHvkwWdABvfnfHYdGDoZtlE6Rug	2026-03-30 12:20:19.726061+00	2026-04-06 12:20:19+00	2	31a73461cada481187d448b9d48e996c
227	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MTQyNiwiaWF0IjoxNzc0ODc2NjI2LCJqdGkiOiI4MDk4MTQ4YjEzMGQ0MWM4OWIwOGM4MmYyNzhhNDZmNyIsInVzZXJfaWQiOiIyIn0.UCQqx56xfTpTEyc1_5z9EEwAxfmyFI51Qaji45vr3ys	2026-03-30 13:17:06.928579+00	2026-04-06 13:17:06+00	2	8098148b130d41c89b08c82f278a46f7
228	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MTU4NCwiaWF0IjoxNzc0ODc2Nzg0LCJqdGkiOiJmMjdhMTE4ODE3Yjg0YTc2YTZhZDdhYjA1ZjA5MmU4OSIsInVzZXJfaWQiOiIyIn0.2CX8SR7bOUEhXMkiUnp9wmabZ32wMHQt0_yXj2lUYic	2026-03-30 13:19:44.957467+00	2026-04-06 13:19:44+00	2	f27a118817b84a76a6ad7ab05f092e89
229	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MTg0NCwiaWF0IjoxNzc0ODc3MDQ0LCJqdGkiOiI4MmQzZmU3M2JlZmY0NDllYmYwZTEyODlmYTQxOWMxOSIsInVzZXJfaWQiOiIzIn0.dXcKdRFxmL_tfWXNMXZGrM3TtDFSHVxo-WppvfgKA7Y	2026-03-30 13:24:04.253901+00	2026-04-06 13:24:04+00	3	82d3fe73beff449ebf0e1289fa419c19
230	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MTk1MiwiaWF0IjoxNzc0ODc3MTUyLCJqdGkiOiIyNzhmNTRiZDNjZjQ0MTBjYmE1OGRiM2I1ZmE2ZWEzMiIsInVzZXJfaWQiOiIzIn0.mU3HiIS19VQXx5-lr3cba7bcjYwiRZn5FxRFC1pdk00	2026-03-30 13:25:52.703985+00	2026-04-06 13:25:52+00	3	278f54bd3cf4410cba58db3b5fa6ea32
231	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjA1NCwiaWF0IjoxNzc0ODc3MjU0LCJqdGkiOiIwNGNlZTQxNzlmNjQ0ODY4YjdkNDhmYzgwMGQwYmUwNCIsInVzZXJfaWQiOiIyIn0.pmZ4CkIBUWM44RnB0N8MYNoUzZtvuou2f40dUtrlilA	2026-03-30 13:27:34.850256+00	2026-04-06 13:27:34+00	2	04cee4179f644868b7d48fc800d0be04
232	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjA4OSwiaWF0IjoxNzc0ODc3Mjg5LCJqdGkiOiJhYzFjYWRhMTUxYjk0NWFiODAwMmRmMzkzNjk0MjhlMyIsInVzZXJfaWQiOiIyIn0.Ty907huRNLLFDJuk_PRCCWbxJKZW6rJfuaCdYnxpkrk	2026-03-30 13:28:09.471667+00	2026-04-06 13:28:09+00	2	ac1cada151b945ab8002df39369428e3
233	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjExNCwiaWF0IjoxNzc0ODc3MzE0LCJqdGkiOiJkYTI4NTExZWM3NDU0ZTQ3ODQ4NmQzZjM3OTVkN2ZjYiIsInVzZXJfaWQiOiIzIn0.mfQ9kzMOz8gcpfc3gYHhXXM2fJp8yq-jfRDg4CpLhYo	2026-03-30 13:28:34.804197+00	2026-04-06 13:28:34+00	3	da28511ec7454e478486d3f3795d7fcb
234	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjIzMCwiaWF0IjoxNzc0ODc3NDMwLCJqdGkiOiI0YzAwYTQ0YzY5ZTQ0OTM1YWJiMzA1OWE2NGI1NTUzMCIsInVzZXJfaWQiOiIzIn0.zRIbTBY2NUY4DDQjUkfDXBlO5PoU2F4Z324jbQCQwdw	2026-03-30 13:30:30.856282+00	2026-04-06 13:30:30+00	3	4c00a44c69e44935abb3059a64b55530
237	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjM0OSwiaWF0IjoxNzc0ODc3NTQ5LCJqdGkiOiJiMGNjYjY2MjM2ZjI0YjM0Yjk5NWJlNzRkZGQ5NzQ4YSIsInVzZXJfaWQiOiIyIn0.3dUZrSQboeGAaXRo3O7CXoxs-ICssjQ3oT-wZM89Oc4	2026-03-30 13:32:29.994288+00	2026-04-06 13:32:29+00	2	b0ccb66236f24b34b995be74ddd9748a
238	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MzA4MSwiaWF0IjoxNzc0ODc4MjgxLCJqdGkiOiJmNmVlNGYzZWViYjk0ZjI3OTBkY2JjOWY0MWZhNDkxZiIsInVzZXJfaWQiOiIyIn0.o1Jypjid-00Ud0YVEEhabhYv4jGYdDB3hz2Mn2Hrmhg	2026-03-30 13:44:41.145058+00	2026-04-06 13:44:41+00	2	f6ee4f3eebb94f2790dcbc9f41fa491f
239	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MzA5OSwiaWF0IjoxNzc0ODc4Mjk5LCJqdGkiOiJkNjYxM2QwMzU5YjA0M2Q0ODM0ZmM2NWE4NmUzZGI3MiIsInVzZXJfaWQiOiIyIn0.XM4z13nouYSITZFFygIJsCYoaUOLntXUVPXmdjd775U	2026-03-30 13:44:59.358797+00	2026-04-06 13:44:59+00	2	d6613d0359b043d4834fc65a86e3db72
240	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MzIxNywiaWF0IjoxNzc0ODc4NDE3LCJqdGkiOiI0YmY5MjgxOWRkOWU0YWIxYjc5OGY5MTcxMzMxMTBlZSIsInVzZXJfaWQiOiIyIn0.xlt4kdcDYVFA8RxaRiMwoEQw65P5gdo6VKSw4HTH_4M	2026-03-30 13:46:57.987312+00	2026-04-06 13:46:57+00	2	4bf92819dd9e4ab1b798f917133110ee
241	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MzQ5NiwiaWF0IjoxNzc0ODc4Njk2LCJqdGkiOiI4YjkyNWY2YmE2Zjg0YzYyYTI3MTQ3N2M3NGQwNmY0MiIsInVzZXJfaWQiOiIyIn0.zLK-_SE8coYE7s4xJ61fCfjixeVzgqFcGqxCidO3k3c	2026-03-30 13:51:36.662863+00	2026-04-06 13:51:36+00	2	8b925f6ba6f84c62a271477c74d06f42
242	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MzYxNCwiaWF0IjoxNzc0ODc4ODE0LCJqdGkiOiI4NzQ2ZmViNGYyMzU0ODkwYjY2OTNhNjc5YWM3OTU4NyIsInVzZXJfaWQiOiIyIn0.JfnuqkEdPVtwTtv3EWi1Yur8ZXua6uyWjI9OWh01RnM	2026-03-30 13:53:34.926844+00	2026-04-06 13:53:34+00	2	8746feb4f2354890b6693a679ac79587
243	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NDA2MCwiaWF0IjoxNzc0ODc5MjYwLCJqdGkiOiIwZTNlOGJlMDY1MTI0NzQxODllZjBkOGRkMjZmN2JlZCIsInVzZXJfaWQiOiIxIn0.iBITtoD502QRg8YYzykp-odd5_XuPw9LFO6yvEyuSsM	2026-03-30 14:01:00.985624+00	2026-04-06 14:01:00+00	1	0e3e8be06512474189ef0d8dd26f7bed
244	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NDQ1NSwiaWF0IjoxNzc0ODc5NjU1LCJqdGkiOiJjZDczNWE1YWI2MmE0NTU2OGM5YTkwZTk3MjZkYjcxZSIsInVzZXJfaWQiOiIyIn0.SOlHlHvZURUVwobZ5ajwqrndZG4MH66yiwRhy7cFh04	2026-03-30 14:07:35.290305+00	2026-04-06 14:07:35+00	2	cd735a5ab62a45568c9a90e9726db71e
245	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NDUxMiwiaWF0IjoxNzc0ODc5NzEyLCJqdGkiOiI4NDFkNjQ1YzdjM2M0NzkyOWJlN2NjZWVlNmU0NGFjNSIsInVzZXJfaWQiOiIyOSJ9.MEZyledA4z2f0tIc-uy9IfwnXPJkuLGOvfty1nHyUPo	2026-03-30 14:08:32.988618+00	2026-04-06 14:08:32+00	29	841d645c7c3c47929be7cceee6e44ac5
246	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NDUzOSwiaWF0IjoxNzc0ODc5NzM5LCJqdGkiOiI2YTAwN2U1YWMxOTY0ZjgyOTZjMTgzMjk3ZDFmZmJlOCIsInVzZXJfaWQiOiIyIn0.aiT-rzIHaseaAouLIgltfNXH_xTIOPXNIQXe1w9RUY8	2026-03-30 14:08:59.216986+00	2026-04-06 14:08:59+00	2	6a007e5ac1964f8296c183297d1ffbe8
247	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NjAyMSwiaWF0IjoxNzc0ODgxMjIxLCJqdGkiOiI1MDNlYzQ3ZTE4ZDY0NDhmYjI0ZTViMTdkYWIyYWQ5YiIsInVzZXJfaWQiOiIxIn0.N_C6T0V6jnoGooTYs1JLi1P3r2NKpAsSWI9bq6bRaK0	2026-03-30 14:33:41.035804+00	2026-04-06 14:33:41+00	1	503ec47e18d6448fb24e5b17dab2ad9b
248	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4NjE2MSwiaWF0IjoxNzc0ODgxMzYxLCJqdGkiOiJiNzM5Yzk2ZjJmYWY0YWRlYjg5N2NjZThmNTM2ODBhNyIsInVzZXJfaWQiOiIyIn0.7TtxY2ZhLICrnouuTyAhF58wAnsrD_cp5d6ZlVQeC04	2026-03-30 14:36:01.876635+00	2026-04-06 14:36:01+00	2	b739c96f2faf4adeb897cce8f53680a7
249	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4Njg4OCwiaWF0IjoxNzc0ODgyMDg4LCJqdGkiOiJlNzIyMWJhNzE0NmM0OWYzYWM3OGRiN2NhYWIwZGVjNyIsInVzZXJfaWQiOiIyIn0.9VXtqkhMcukA03d5yJnmCoPTqmhqA9gccgz4Mg4o3fc	2026-03-30 14:48:08.496055+00	2026-04-06 14:48:08+00	2	e7221ba7146c49f3ac78db7caab0dec7
250	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4Nzk4NSwiaWF0IjoxNzc0ODgzMTg1LCJqdGkiOiJiODI1ZTA3YTM0ZDA0ZDU5ODBjN2QwNmU3MmZhMDFlZCIsInVzZXJfaWQiOiIyIn0.KafchSLkzWhxwIIMhMjOwq6H6LFCfOQDj_08X-Vn4fo	2026-03-30 15:06:25.296518+00	2026-04-06 15:06:25+00	2	b825e07a34d04d5980c7d06e72fa01ed
251	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4ODE1MywiaWF0IjoxNzc0ODgzMzUzLCJqdGkiOiI3ODk2ZDFhYjgzMTA0MzljYTk0NzlkOGJjYTcxYjA1OCIsInVzZXJfaWQiOiIxIn0.WPewzJovEhQlCbYafwwFuxPkRT_VVGD0as5cdEmyLFU	2026-03-30 15:09:13.207117+00	2026-04-06 15:09:13+00	1	7896d1ab8310439ca9479d8bca71b058
252	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5MzcwMCwiaWF0IjoxNzc0ODg4OTAwLCJqdGkiOiJiYjMxN2M2MDU5NzE0MDA0OGU3NzJkYmM1NmM2OTZmOCIsInVzZXJfaWQiOiIyIn0.YStl3vEUVE5Z9429aJ1j1CKqxKvYeY05R6k8k5Ir6jo	2026-03-30 16:41:40.295846+00	2026-04-06 16:41:40+00	2	bb317c60597140048e772dbc56c696f8
253	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5MzcyNSwiaWF0IjoxNzc0ODg4OTI1LCJqdGkiOiIxMjY1MjU4Zjk5Y2M0Zjg5OWM3OTJkMzYzNzdhNjJkYSIsInVzZXJfaWQiOiIxIn0.povE9KApvZpodKYkWvhy-qGVzCMZNYB7M5n02Y3ZkpE	2026-03-30 16:42:05.624949+00	2026-04-06 16:42:05+00	1	1265258f99cc4f899c792d36377a62da
254	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5NzQyNCwiaWF0IjoxNzc0ODkyNjI0LCJqdGkiOiJmMWZkMzA1ZmI1MDU0ZWU3OWNiZmUzMDE2ZGU2N2Y3MSIsInVzZXJfaWQiOiIxIn0.550RbXSnqoGjyM6aN_lq9np9iPO7bSQIcbtCEL6VMAQ	2026-03-30 17:43:44.962099+00	2026-04-06 17:43:44+00	1	f1fd305fb5054ee79cbfe3016de67f71
255	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5NzQ0MiwiaWF0IjoxNzc0ODkyNjQyLCJqdGkiOiJkYzJmNzFiMTkxZDI0NDdjODJhMTQxNjRhMDA5ZGY1YyIsInVzZXJfaWQiOiIyIn0.DT96UWEN8_I9atOlDBIGCo6JPUKqhOs8-DYT88VyxnY	2026-03-30 17:44:02.18587+00	2026-04-06 17:44:02+00	2	dc2f71b191d2447c82a14164a009df5c
256	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5OTI1NSwiaWF0IjoxNzc0ODk0NDU1LCJqdGkiOiI5ZjBhY2VmNzhiOGY0ZWRlYjhmODJiYzNiNjZlMjExYiIsInVzZXJfaWQiOiIyIn0.Vh3VBBZUu39np1R5JI6vZFBqmkN66IGiacaTl-ut3_U	2026-03-30 18:14:15.639509+00	2026-04-06 18:14:15+00	2	9f0acef78b8f4edeb8f82bc3b66e211b
257	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ5OTI2NiwiaWF0IjoxNzc0ODk0NDY2LCJqdGkiOiJkMTUwMzAyZmJlZTc0ZmM2YWRjNTEwZTkxMjJhNDJjMiIsInVzZXJfaWQiOiIyIn0.-rmF8IgAU6TktiRy2gJXyY9j_PBwQALdj89niLcbE4I	2026-03-30 18:14:26.173323+00	2026-04-06 18:14:26+00	2	d150302fbee74fc6adc510e9122a42c2
258	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMTQ0NywiaWF0IjoxNzc0ODk2NjQ3LCJqdGkiOiJlM2UwYjIwNTc1NmI0YmE4OGE2NjBmMmIxZGFhOTM1NiIsInVzZXJfaWQiOiIyIn0.hdpAHUU1tTpkVuDrnJXXCvuRB3YqaEtKoOSVvcndYGg	2026-03-30 18:50:47.8854+00	2026-04-06 18:50:47+00	2	e3e0b205756b4ba88a660f2b1daa9356
259	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMTQ4MywiaWF0IjoxNzc0ODk2NjgzLCJqdGkiOiIwMGU4NDI1OTNkMDY0ODFhYmI5OWQ4ZjM0NjQ1OGUxNCIsInVzZXJfaWQiOiIyIn0._sajh0ziZTqJtFE3GhWtk1jQr4Yf8hldeAjGft9-IpA	2026-03-30 18:51:23.334334+00	2026-04-06 18:51:23+00	2	00e842593d06481abb99d8f346458e14
260	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMzI4MywiaWF0IjoxNzc0ODk4NDgzLCJqdGkiOiI2ZDE3N2QwMTFiNzE0YWE5ODhkNmVhYzQ4ODQ5M2QwNCIsInVzZXJfaWQiOiIyIn0.gi6uslBDim-mnNzZg-d9LpiUMojyH9xgFO62X2lfw0E	2026-03-30 19:21:23.536676+00	2026-04-06 19:21:23+00	2	6d177d011b714aa988d6eac488493d04
261	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMzI4MywiaWF0IjoxNzc0ODk4NDgzLCJqdGkiOiI0YWE0MGJiYTMxZmU0YTEyYTViNzVkMzc2MTMzMjk1OCIsInVzZXJfaWQiOiIyIn0.dQxXTnv3K8DTN_i3S5M0bgXykETMG4QBLKCJcuFxB40	2026-03-30 19:21:23.543581+00	2026-04-06 19:21:23+00	2	4aa40bba31fe4a12a5b75d3761332958
262	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMzMwMywiaWF0IjoxNzc0ODk4NTAzLCJqdGkiOiI3YTFiMDEyZWI3ZGQ0NjVmYmQ1YjM2ZWRmZjkzYjg4NyIsInVzZXJfaWQiOiIyIn0.9Qboseg_xIqvtCl1ZCLI3A84JyhAJkSPA05RMUCKFGE	2026-03-30 19:21:43.280543+00	2026-04-06 19:21:43+00	2	7a1b012eb7dd465fbd5b36edff93b887
263	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwMzc4NiwiaWF0IjoxNzc0ODk4OTg2LCJqdGkiOiJiODdlNDc4MjI2N2I0NzY1OGM5NTI1NzMwMTkwNWY2NiIsInVzZXJfaWQiOiIyIn0.dj_x0UU2mw3KAMXoONGlrJjEMsa-09rE9ufsH8bufAg	2026-03-30 19:29:46.77863+00	2026-04-06 19:29:46+00	2	b87e4782267b47658c95257301905f66
264	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwNjgxNywiaWF0IjoxNzc0OTAyMDE3LCJqdGkiOiI0ZDIzOWI5YzJlMGI0MTVmYTczODMyYTE1YTYwMWVmNSIsInVzZXJfaWQiOiIxIn0.P-decYEbpMvAAVXrHGXm2RgmFpkNOW7Pqg5WJuiYrSk	2026-03-30 20:20:17.498819+00	2026-04-06 20:20:17+00	1	4d239b9c2e0b415fa73832a15a601ef5
265	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwNjg0OSwiaWF0IjoxNzc0OTAyMDQ5LCJqdGkiOiI0NDc2NmY5MWNmNWY0ZmYzYmY4YzQyYmUyYzM4MDY2MCIsInVzZXJfaWQiOiIyIn0.GfEaROvO-Gp6w_zc4_8FOotJ1aIr6IkkjZ0DmMwIxGc	2026-03-30 20:20:49.098211+00	2026-04-06 20:20:49+00	2	44766f91cf5f4ff3bf8c42be2c380660
266	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwODY0OSwiaWF0IjoxNzc0OTAzODQ5LCJqdGkiOiIzMDJiMDdjYTIwYTk0ZmViOTBlM2E4MjU3ODhkZTE4NiIsInVzZXJfaWQiOiIyIn0.zpNGVvpbw9U49XZe-kkHcc_pxZqTFPtoLxU7tqdEnf4	2026-03-30 20:50:49.434036+00	2026-04-06 20:50:49+00	2	302b07ca20a94feb90e3a825788de186
267	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwODY0OSwiaWF0IjoxNzc0OTAzODQ5LCJqdGkiOiJiZTM1YThkMWE2NTA0ZmI1OGZlNmMwNTNlNDA2ZWZhNCIsInVzZXJfaWQiOiIyIn0.nTIEIgSIICursekpJ-YaGrRL2D1TQh-KFAxpfc_Z24g	2026-03-30 20:50:49.434451+00	2026-04-06 20:50:49+00	2	be35a8d1a6504fb58fe6c053e406efa4
268	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUwODY2MiwiaWF0IjoxNzc0OTAzODYyLCJqdGkiOiI5N2E0NTM2MjU3ODY0NmQ5ODhlZTliYzY4MTEyZTQ1YiIsInVzZXJfaWQiOiIyIn0.Eyt_pwiq4ODLincqY7fcI_PQSTLnQllkn0EGspCqItc	2026-03-30 20:51:02.687063+00	2026-04-06 20:51:02+00	2	97a45362578646d988ee9bc68112e45b
269	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUxMDQ2MiwiaWF0IjoxNzc0OTA1NjYyLCJqdGkiOiI2NGNmNzM3OTk3MjM0OTNkODhkYmY0ODU0MWFkYTZlYyIsInVzZXJfaWQiOiIyIn0.Hotd9GlUUCPoGeQ69QUnVoDqdC2hYuQaJm6tZs15VZ4	2026-03-30 21:21:02.928235+00	2026-04-06 21:21:02+00	2	64cf73799723493d88dbf48541ada6ec
270	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUxMDQ3MCwiaWF0IjoxNzc0OTA1NjcwLCJqdGkiOiJkNTkxZWJjMTk1YzY0NWJjODdhNTcyMDAwMDE1MDU2YyIsInVzZXJfaWQiOiIyIn0.9jU2_uymg0SDxdPtknaEYx-td8vIWK3C4X_vN-U5zig	2026-03-30 21:21:10.716187+00	2026-04-06 21:21:10+00	2	d591ebc195c645bc87a572000015056c
271	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUxMjI3MCwiaWF0IjoxNzc0OTA3NDcwLCJqdGkiOiI5MzZiNzUwNWU4ZGI0NDkwYWMwNmQyOWQ4ZDhkZDY4NyIsInVzZXJfaWQiOiIyIn0.mGNZu_AiKJ3mcw4WZu1JSeYDa8CF5gm6pZwPftlRnVQ	2026-03-30 21:51:10.736185+00	2026-04-06 21:51:10+00	2	936b7505e8db4490ac06d29d8d8dd687
272	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUxMjgxNywiaWF0IjoxNzc0OTA4MDE3LCJqdGkiOiI2ZWY0NTYyZWNkMDk0ODY3YjMxZTEzNmU4ZTQ4ZDIyNyIsInVzZXJfaWQiOiIyIn0.mFAIi0Zf5vQejTSrGvXiEwtlD7DZNcM5Dzs5NdHCZFE	2026-03-30 22:00:17.087733+00	2026-04-06 22:00:17+00	2	6ef4562ecd094867b31e136e8e48d227
273	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUxNDYxOCwiaWF0IjoxNzc0OTA5ODE4LCJqdGkiOiJiMTgyOGZiZGQ3ZDI0MmZlODFhMDAyYTYzM2Q3YzNjMCIsInVzZXJfaWQiOiIyIn0.8s76cz7pJlvXZiYBW3w1T8-K8yvkElXlwks7ak3kM7M	2026-03-30 22:30:18.206244+00	2026-04-06 22:30:18+00	2	b1828fbdd7d242fe81a002a633d7c3c0
274	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyMDE4MSwiaWF0IjoxNzc0OTE1MzgxLCJqdGkiOiJlOGExMjZlMzEzZDQ0ZGQ4OGUwZWExNjJjMWVmYmE4ZSIsInVzZXJfaWQiOiIyIn0.eYxXZ3GoKWt9fW3okGuWSaYizZ2hWADbM8V_jegIM3A	2026-03-31 00:03:01.228068+00	2026-04-07 00:03:01+00	2	e8a126e313d44dd88e0ea162c1efba8e
275	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyMTQ1OSwiaWF0IjoxNzc0OTE2NjU5LCJqdGkiOiIwN2RmOWE1MjNjZWY0YmY4YWIwOTFmMGNlZTU2YzVlZCIsInVzZXJfaWQiOiIyIn0.EnUoxerxqccxukxerNlQVQ3FWEi-WNC89cG7Y0mq-ak	2026-03-31 00:24:19.257964+00	2026-04-07 00:24:19+00	2	07df9a523cef4bf8ab091f0cee56c5ed
276	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyNDYxNiwiaWF0IjoxNzc0OTE5ODE2LCJqdGkiOiJhN2EyY2FkYmE1MmY0ZTc1OTBjNzBmODAzOGQzNjJjMCIsInVzZXJfaWQiOiIyIn0.pWp9Hh5z30jjkjjot8UucashU0PKfuKkwLRUif-W6o8	2026-03-31 01:16:56.544254+00	2026-04-07 01:16:56+00	2	a7a2cadba52f4e7590c70f8038d362c0
277	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyNjQxOCwiaWF0IjoxNzc0OTIxNjE4LCJqdGkiOiIzZGRkZDNjNjAzYWI0OGQxYjExNTBhODMwY2M4ZThmNSIsInVzZXJfaWQiOiIyIn0.VKI_SGb6pXtOhKGm0lrBeqAUc45WauW0bNN0RNZmZB8	2026-03-31 01:46:58.874829+00	2026-04-07 01:46:58+00	2	3dddd3c603ab48d1b1150a830cc8e8f5
278	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyNjQxOSwiaWF0IjoxNzc0OTIxNjE5LCJqdGkiOiI3OTkzMDNhYTMzMjM0ZjkwOGQ0Mzc1N2FlYjU2NTJkYiIsInVzZXJfaWQiOiIyIn0.tw1Tis8O7q6joOAhod_Y-Qg5xupHTEZvC3M5WJfupI0	2026-03-31 01:46:59.199939+00	2026-04-07 01:46:59+00	2	799303aa33234f908d43757aeb5652db
279	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyNjQyNiwiaWF0IjoxNzc0OTIxNjI2LCJqdGkiOiJjYzdiOWRlYjVjZGE0YmM4YTU1NTNlMzkwMTMyNjhjMCIsInVzZXJfaWQiOiIyIn0.RSAU1JdCfQzsa1_Nx3pHj6t7m7tu14nL9-pFXuLF-lk	2026-03-31 01:47:06.320874+00	2026-04-07 01:47:06+00	2	cc7b9deb5cda4bc8a5553e39013268c0
280	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyODIyNiwiaWF0IjoxNzc0OTIzNDI2LCJqdGkiOiI1NjQwYjI0YjU3YTM0MTE3ODdkNDVmZjQwMWViNTg5ZCIsInVzZXJfaWQiOiIyIn0.LEJDUeIqqbVPCDrUSlmRDgzO4Ie-FeyWFn1KuCRSxSY	2026-03-31 02:17:06.991548+00	2026-04-07 02:17:06+00	2	5640b24b57a3411787d45ff401eb589d
281	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyODIyNiwiaWF0IjoxNzc0OTIzNDI2LCJqdGkiOiIwMTYwNWMyZDEwZmI0ZDVjODllNGY5YTViZjcxNDMyNyIsInVzZXJfaWQiOiIyIn0.0FHRwd4c_IDupljWGOSKV48lp1Stqh89vTt3dLPRmmM	2026-03-31 02:17:06.992824+00	2026-04-07 02:17:06+00	2	01605c2d10fb4d5c89e4f9a5bf714327
282	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUyODUwNywiaWF0IjoxNzc0OTIzNzA3LCJqdGkiOiI0NmIzM2FkZDMzZGE0YmY5YjUyZjA5NWNiYjI2NDdmMCIsInVzZXJfaWQiOiIyIn0.818u5moKSNucD_lWX10SnkNBAGk0Quyfqpzr8Tgvc3Q	2026-03-31 02:21:47.225518+00	2026-04-07 02:21:47+00	2	46b33add33da4bf9b52f095cbb2647f0
283	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUzMDMwNywiaWF0IjoxNzc0OTI1NTA3LCJqdGkiOiJlMmZhOWI3ODk5NDU0MGNmYWI5NGNlZWM5NTdmMGYyOCIsInVzZXJfaWQiOiIyIn0.A925S0IKfkRd97kzUNC2sLZ8GmFvWB7VdVXc-fdI_qA	2026-03-31 02:51:47.21665+00	2026-04-07 02:51:47+00	2	e2fa9b78994540cfab94ceec957f0f28
284	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTUzMDMyOSwiaWF0IjoxNzc0OTI1NTI5LCJqdGkiOiI3N2ZjYzI2ZWUxYTU0NzhkYjZlYmJhZDk2MTgwNGQ2MyIsInVzZXJfaWQiOiIyIn0.IDLMeD31r_201JoOl40q2ARbUYMdSe5HdodjoIvHvbk	2026-03-31 02:52:09.538415+00	2026-04-07 02:52:09+00	2	77fcc26ee1a5478db6ebbad961804d63
285	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU2NTkzMywiaWF0IjoxNzc0OTYxMTMzLCJqdGkiOiI1NzcyOGFmZjIzOTY0YWU5OTVhZmIyMWE4YTE1Y2M1MSIsInVzZXJfaWQiOiIyIn0.yJ3fcpWjhH0tqMx9gUs0FeOY9NvEAs8vUEYSJbDhzuA	2026-03-31 12:45:33.232525+00	2026-04-07 12:45:33+00	2	57728aff23964ae995afb21a8a15cc51
286	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU2NTkzMywiaWF0IjoxNzc0OTYxMTMzLCJqdGkiOiJjYmQ2Njk5MzkxM2Y0NWY1OWFiZjc3MzE3Y2VjNzRkMyIsInVzZXJfaWQiOiIyIn0.yNjUQTE3Zju882lmaloqF62_oj7iSEBz7qyYtOsHevQ	2026-03-31 12:45:33.251016+00	2026-04-07 12:45:33+00	2	cbd66993913f45f59abf77317cec74d3
287	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU3MDI5NiwiaWF0IjoxNzc0OTY1NDk2LCJqdGkiOiIzZTI2MzcyNDNkMTQ0NGExYTFkNGNmM2Q5NzhhOTY2NyIsInVzZXJfaWQiOiIyIn0.__QLXEC6qAak_tB4JOsyrl0v3KxeADGUPDdb8tJCNVE	2026-03-31 13:58:16.630849+00	2026-04-07 13:58:16+00	2	3e2637243d1444a1a1d4cf3d978a9667
288	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU3MDc1MywiaWF0IjoxNzc0OTY1OTUzLCJqdGkiOiI3MzUzZTFlNTYzYTM0YmY4YWJiMjI1M2Q2NDE5MmViNyIsInVzZXJfaWQiOiIyIn0.zBoDiKqxh_35jvvhOKLNwNryg7a1P_FzaVIQVFhJfLs	2026-03-31 14:05:53.326358+00	2026-04-07 14:05:53+00	2	7353e1e563a34bf8abb2253d64192eb7
289	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU3MjU1MywiaWF0IjoxNzc0OTY3NzUzLCJqdGkiOiJiNDkzM2QzMTA3MDg0YzZlYTVlYTZmOTllMmJiYTI3ZCIsInVzZXJfaWQiOiIyIn0.cimZm2s6CSGCYAYwN7H00iX_YhJD41LoEvS3nu3enqg	2026-03-31 14:35:53.229853+00	2026-04-07 14:35:53+00	2	b4933d3107084c6ea5ea6f99e2bba27d
290	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU3MjU1MywiaWF0IjoxNzc0OTY3NzUzLCJqdGkiOiJkMTRjOWEyYzk0MDU0ZTM2YWEyYTgwN2IxOTkzNDg2MyIsInVzZXJfaWQiOiIyIn0.jhhBFobm4cljAVXk3BmPjs4V2lr4PhYDESYFU7Y_dt0	2026-03-31 14:35:53.236721+00	2026-04-07 14:35:53+00	2	d14c9a2c94054e36aa2a807b19934863
291	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU3OTU3NiwiaWF0IjoxNzc0OTc0Nzc2LCJqdGkiOiIyNGZhMGMwZjA1NmU0Yzk4YWJmNmM2YmJkMjBhOWUzMyIsInVzZXJfaWQiOiIxIn0.ksO8KAIuBR8IC-4qtchFtszN3IQRPR_umplQE0XKI5Y	2026-03-31 16:32:56.019996+00	2026-04-07 16:32:56+00	1	24fa0c0f056e4c98abf6c6bbd20a9e33
292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU5NTQxNCwiaWF0IjoxNzc0OTkwNjE0LCJqdGkiOiI0MTMyMjk5NWI1NDQ0M2U5OGM4YjYyMTE5MTQ5ZGFlMSIsInVzZXJfaWQiOiIyIn0.ztExZG3LTd4AtgxjoHMB8sHoEWmTYNbKvOrb7nfvcG0	2026-03-31 20:56:54.955266+00	2026-04-07 20:56:54+00	2	41322995b54443e98c8b62119149dae1
293	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU5NTYxNCwiaWF0IjoxNzc0OTkwODE0LCJqdGkiOiIwMDkzZTg4ZDRmYmY0NzQ3ODQ1YWU0OWVjM2ExNzJjMiIsInVzZXJfaWQiOiIyIn0.qVDGa2U12na49dOs3qmn9LmX_lqTnRBXQUT-BKTwXQM	2026-03-31 21:00:14.042008+00	2026-04-07 21:00:14+00	2	0093e88d4fbf4747845ae49ec3a172c2
294	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU5NzYwOCwiaWF0IjoxNzc0OTkyODA4LCJqdGkiOiJhNjMwNWM1NzNiYzg0NmRhYTBhNWY0MjgzMjBjYjY2YiIsInVzZXJfaWQiOiIyIn0.NPCa5AgYZvMS1j3Ww2Z5kupjx1L53wUNTfeiVqzYHsA	2026-03-31 21:33:28.929603+00	2026-04-07 21:33:28+00	2	a6305c573bc846daa0a5f428320cb66b
295	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU5NzcwMiwiaWF0IjoxNzc0OTkyOTAyLCJqdGkiOiIwYjNkM2IxMWM2OWU0YzVhYjkzZjhhZTVlOTY2ZWY2ZiIsInVzZXJfaWQiOiIyIn0.DGAte4-JM_7Et5oSu67kbTr6Qc8uLPJR398LpCEOPg0	2026-03-31 21:35:02.401693+00	2026-04-07 21:35:02+00	2	0b3d3b11c69e4c5ab93f8ae5e966ef6f
296	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTU5ODQ1NSwiaWF0IjoxNzc0OTkzNjU1LCJqdGkiOiJjNTdhNzY5M2I0ZmI0MjIyODY5MzNlYTJkNGUyZjc1MCIsInVzZXJfaWQiOiIyIn0.WfAh3LpfzNeIyGECRz3CxRYRiBjRTg2hOJ5_uia5QFY	2026-03-31 21:47:35.980581+00	2026-04-07 21:47:35+00	2	c57a7693b4fb422286933ea2d4e2f750
297	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYwNzg0OSwiaWF0IjoxNzc1MDAzMDQ5LCJqdGkiOiJjM2M1NzViYzI2YjY0MzAwYmFjNTQ5YTU2MWIyOWQyNyIsInVzZXJfaWQiOiIyIn0.JWyB1Hqwtwf2B-n7W2-fhziAhnP7jQ7JyljEPdti97A	2026-04-01 00:24:09.507193+00	2026-04-08 00:24:09+00	2	c3c575bc26b64300bac549a561b29d27
298	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYwODE0MiwiaWF0IjoxNzc1MDAzMzQyLCJqdGkiOiIzMzdlMjdiYjdkYmQ0MzYxYTlmY2QwZTAxOGUxOTNkMyIsInVzZXJfaWQiOiIyIn0.5_goaCiBk_HLua9kqFA24YWpAM5OS8XFHAvjJC8BIxM	2026-04-01 00:29:02.775719+00	2026-04-08 00:29:02+00	2	337e27bb7dbd4361a9fcd0e018e193d3
299	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYwODg1NSwiaWF0IjoxNzc1MDA0MDU1LCJqdGkiOiIxODRhYmU4ZDUxNWM0OTNhOGRjYWZlZTkyYjhhOGZiZSIsInVzZXJfaWQiOiIyIn0.i38Ae9Sh15zgg04gXyKQWLN_YIbCMppRH7OtllCa7s4	2026-04-01 00:40:55.512712+00	2026-04-08 00:40:55+00	2	184abe8d515c493a8dcafee92b8a8fbe
300	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxMDY1NSwiaWF0IjoxNzc1MDA1ODU1LCJqdGkiOiJiZWQ3MTY2M2U3ZTU0MWJkYjQyNjM3NjZjYzE0MWQ0NyIsInVzZXJfaWQiOiIyIn0.XGU0yW4tTijhFHwlqsNKxnUO4QwEzgjHhuXibpSEuOQ	2026-04-01 01:10:55.51909+00	2026-04-08 01:10:55+00	2	bed71663e7e541bdb4263766cc141d47
301	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxMDcwMiwiaWF0IjoxNzc1MDA1OTAyLCJqdGkiOiI4YTA0N2Y1ZjQ3NjA0MzY3ODRkNWVmNDRkZDk1YTc5YSIsInVzZXJfaWQiOiIyIn0.vrprpjMlX8BQwKUprfhYi2O_e8QrYTWG4EPgAiUWOz8	2026-04-01 01:11:42.967228+00	2026-04-08 01:11:42+00	2	8a047f5f4760436784d5ef44dd95a79a
302	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxMjczMiwiaWF0IjoxNzc1MDA3OTMyLCJqdGkiOiJjNmM5YTMzNDUxYmI0MWRlOWE2ZjA4ZTg4YTQzOTE4ZCIsInVzZXJfaWQiOiIyIn0.3_bPBeWlBgxkFPl2qurh0aXPxQsYgBGKie3IeoJCTC4	2026-04-01 01:45:32.788834+00	2026-04-08 01:45:32+00	2	c6c9a33451bb41de9a6f08e88a43918d
303	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxMjczMiwiaWF0IjoxNzc1MDA3OTMyLCJqdGkiOiIwZGI3NjRjZDY2OTk0ODZiODcwMmQyNzM3MTM1YjcyZiIsInVzZXJfaWQiOiIyIn0._MXwPG2Xi5Uue0V5AtV8Rtj6pfSDxTB-06XSgRBxHgw	2026-04-01 01:45:32.784496+00	2026-04-08 01:45:32+00	2	0db764cd6699486b8702d2737135b72f
304	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxMzI0MywiaWF0IjoxNzc1MDA4NDQzLCJqdGkiOiI5NGY2ODdlY2FiZGQ0M2JjYTU3NjRlYjBkM2I4OGU5NiIsInVzZXJfaWQiOiIyIn0.x8B8HvE-dM8dx2u9p-eAS8U_Uaqcm3OSkVJ4u16aMEw	2026-04-01 01:54:03.498635+00	2026-04-08 01:54:03+00	2	94f687ecabdd43bca5764eb0d3b88e96
337	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNTA0MywiaWF0IjoxNzc1MDEwMjQzLCJqdGkiOiI1YWMxNDcyMzBhZGE0ODU0OGEwYmI2NDYzOWQ0MWRhOSIsInVzZXJfaWQiOiIyIn0.oaTT6pj4f7wm1helbSoE3N6cBuG30YTIpcC6YBIPnZw	2026-04-01 02:24:03.242051+00	2026-04-08 02:24:03+00	2	5ac147230ada48548a0bb64639d41da9
338	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNTA0MywiaWF0IjoxNzc1MDEwMjQzLCJqdGkiOiI1NmQyNjE5ZThmNmQ0NTJiYWE1OTM4MTQ4OTY5MGE2ZCIsInVzZXJfaWQiOiIyIn0.v5IDqPel7Ev0EJQ8qstTe46joMfj5gBgLwbIXs2JTLQ	2026-04-01 02:24:03.630026+00	2026-04-08 02:24:03+00	2	56d2619e8f6d452baa59381489690a6d
339	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNTIzOCwiaWF0IjoxNzc1MDEwNDM4LCJqdGkiOiJkMTQzNzc5NmM3ZWU0MTEzODk4OTU4MDA2N2JjMWE1NSIsInVzZXJfaWQiOiIyIn0.2oHNq3g_GrzbP1GdJT25Y3Yg1Wklmbbzum_rOksm-YI	2026-04-01 02:27:18.423268+00	2026-04-08 02:27:18+00	2	d1437796c7ee41138989580067bc1a55
340	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNTc3MCwiaWF0IjoxNzc1MDEwOTcwLCJqdGkiOiIzNDk2YjNjZTllNWQ0N2RhOWZiNzlkODZlZjFmZDI4MiIsInVzZXJfaWQiOiIyIn0.dnK_bvgtpBP4eFV6hHeowSIUqRqg_tDR2pZc_835Duo	2026-04-01 02:36:10.31529+00	2026-04-08 02:36:10+00	2	3496b3ce9e5d47da9fb79d86ef1fd282
341	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNzU3MCwiaWF0IjoxNzc1MDEyNzcwLCJqdGkiOiI1NDQyM2RiZTQwYmE0YmUwOTA5NTM4ZWM1MjA0YjIwNiIsInVzZXJfaWQiOiIyIn0.72ui7Gd8aU-Q77_fITaMpiNiYck85w_ssZACz4xJNp8	2026-04-01 03:06:10.33151+00	2026-04-08 03:06:10+00	2	54423dbe40ba4be0909538ec5204b206
342	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNzU3MCwiaWF0IjoxNzc1MDEyNzcwLCJqdGkiOiI3Y2ZhM2EzODRmZWY0YzQ1YWQyMDc3Yzc3YmY4YTlhZCIsInVzZXJfaWQiOiIyIn0.0NAbn3vxFFp5ExcmdJ-by6et0eZJIn6T7skUQZD0v8E	2026-04-01 03:06:10.34252+00	2026-04-08 03:06:10+00	2	7cfa3a384fef4c45ad2077c77bf8a9ad
343	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxNzc4OSwiaWF0IjoxNzc1MDEyOTg5LCJqdGkiOiI5ZTdmOGViNGJjYTU0Y2M3OTJkMmQwOGM4NmE4NTIzNSIsInVzZXJfaWQiOiIyIn0.7GMpPNz7gMrRC_qOsKAN1JLp3Gv6SdOUP4OrujpjUMY	2026-04-01 03:09:49.739073+00	2026-04-08 03:09:49+00	2	9e7f8eb4bca54cc792d2d08c86a85235
344	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxOTU4OSwiaWF0IjoxNzc1MDE0Nzg5LCJqdGkiOiI4NWY5YzU2NmZkYTk0ZjIyYTRiMWE0OGZjNTZiNDRiZiIsInVzZXJfaWQiOiIyIn0.kRlncZS-QYWWI29KaEsCrcEGIJZdkqQ9yzxoSuinttk	2026-04-01 03:39:49.432023+00	2026-04-08 03:39:49+00	2	85f9c566fda94f22a4b1a48fc56b44bf
345	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTYxOTYxNSwiaWF0IjoxNzc1MDE0ODE1LCJqdGkiOiI3N2NjZmRiMzM1ODg0YTIxYTI0MzYxMDlhN2JiOTE3OCIsInVzZXJfaWQiOiIyIn0.fN-Nmb5_mdXETrAyo820YxKau59h289i9iwg-AFWKU4	2026-04-01 03:40:15.184847+00	2026-04-08 03:40:15+00	2	77ccfdb335884a21a2436109a7bb9178
346	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1NDc2NiwiaWF0IjoxNzc1MDQ5OTY2LCJqdGkiOiJkZDY2YTgwYmVkZTE0NDdmYThmNTQ5ODQxODMxOGMwNCIsInVzZXJfaWQiOiIyIn0.eVQCOTaO3-Gvdk90ypNkPaLcs2VfJ5D28ptZW4jbMlA	2026-04-01 13:26:06.189873+00	2026-04-08 13:26:06+00	2	dd66a80bede1447fa8f5498418318c04
347	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1NDgzNSwiaWF0IjoxNzc1MDUwMDM1LCJqdGkiOiJhNTA5OTdmYTEzMGM0ZDA4YjQyYTFmZWRmZjQ3MmY2OCIsInVzZXJfaWQiOiIyIn0.n0qRNlx4QeLO5qvOIRGPvZWe2cxd8RMIV2HltEEZzjY	2026-04-01 13:27:15.712684+00	2026-04-08 13:27:15+00	2	a50997fa130c4d08b42a1fedff472f68
348	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1NjYzNiwiaWF0IjoxNzc1MDUxODM2LCJqdGkiOiI5YWJjZTc2ZDg5NzQ0Y2I4YWJlZDA0YWVmNGFjNzcxNyIsInVzZXJfaWQiOiIyIn0.7N5f0WynlHw2ZOnbH4CUcp0k-_I7kMfeAT6bfnhD1oU	2026-04-01 13:57:16.550972+00	2026-04-08 13:57:16+00	2	9abce76d89744cb8abed04aef4ac7717
349	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1NjYzNiwiaWF0IjoxNzc1MDUxODM2LCJqdGkiOiI5YzcyMmMyZThlNTc0ZTk1YmQ4Y2ZlMWViNWMwMWYwZCIsInVzZXJfaWQiOiIyIn0.qS3caFWhtUEkz5fvteU2uV68eHdfJsk0pCS3FopPHxs	2026-04-01 13:57:16.553197+00	2026-04-08 13:57:16+00	2	9c722c2e8e574e95bd8cfe1eb5c01f0d
350	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1NjgxNiwiaWF0IjoxNzc1MDUyMDE2LCJqdGkiOiIwZGYyYmI5NDhjNjM0N2QwYjI5M2M1YjllYTZiM2Y3ZCIsInVzZXJfaWQiOiIyIn0.bFxK2cg87jC_3QDHnaOpdnYGxyHVEWkMA_d991EvyZQ	2026-04-01 14:00:16.840325+00	2026-04-08 14:00:16+00	2	0df2bb948c6347d0b293c5b9ea6b3f7d
351	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1ODYxNiwiaWF0IjoxNzc1MDUzODE2LCJqdGkiOiJjMGRhNmUyNDZjMzg0MWYzYjc4ZjMyNzZmZTQ0ODNmZCIsInVzZXJfaWQiOiIyIn0.MKFtpEZhhicwgZGXZEwOsNFQp_WksZbk-B6UxYnXXdw	2026-04-01 14:30:16.925422+00	2026-04-08 14:30:16+00	2	c0da6e246c3841f3b78f3276fe4483fd
352	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY1ODYxNiwiaWF0IjoxNzc1MDUzODE2LCJqdGkiOiI3MzcxN2ZkOWViYTE0NWUxYmQ1M2RmNTIyMjNkMWE5MiIsInVzZXJfaWQiOiIyIn0.TjWJF7sXElDQmRwdfsYMJ2XXy5ftAFV1UCg0hvpS8Rc	2026-04-01 14:30:16.920835+00	2026-04-08 14:30:16+00	2	73717fd9eba145e1bd53df52223d1a92
353	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY2MDY0MywiaWF0IjoxNzc1MDU1ODQzLCJqdGkiOiIyMzIzM2U3MGQ0NDc0ZjNjYTViMzUyYWYzZjU5NjM0ZiIsInVzZXJfaWQiOiIyIn0.T7fTOniuadd0LYJ-7rcF-VFWF0qFV7R3ovQi2iXtNrM	2026-04-01 15:04:03.297616+00	2026-04-08 15:04:03+00	2	23233e70d4474f3ca5b352af3f59634f
354	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY2MjQ0MywiaWF0IjoxNzc1MDU3NjQzLCJqdGkiOiIzOGFlOGM1ZjliZjI0MTEyYWM1YzA3MGJjNzhmY2E2ZSIsInVzZXJfaWQiOiIyIn0.vn-8xcvggOzwqHNQj8zIpAQl33qQdPNLQeDp4cdcGbg	2026-04-01 15:34:03.410704+00	2026-04-08 15:34:03+00	2	38ae8c5f9bf24112ac5c070bc78fca6e
355	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY2MjQ0MywiaWF0IjoxNzc1MDU3NjQzLCJqdGkiOiJiMjFjY2Q5NTZkNWM0NTk1OTU4Nzc3YTdhMDcyNjM2NCIsInVzZXJfaWQiOiIyIn0.9Sg_Y56NfPWcBJrOVuD-qGVq4F2HLq_us6juTmosqmg	2026-04-01 15:34:03.412667+00	2026-04-08 15:34:03+00	2	b21ccd956d5c4595958777a7a0726364
356	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY2MjQ0OSwiaWF0IjoxNzc1MDU3NjQ5LCJqdGkiOiI1ZWFmYTAyYmYwZmM0ZmQxODNhYzM5Njk2MzUyM2I5NCIsInVzZXJfaWQiOiIyIn0.GNyKCMjKBPCsZz0_UnlAvfzsmNR5V-tk1l8FeU2J0z0	2026-04-01 15:34:09.66463+00	2026-04-08 15:34:09+00	2	5eafa02bf0fc4fd183ac396963523b94
357	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY2NDI0OSwiaWF0IjoxNzc1MDU5NDQ5LCJqdGkiOiIxZjU0M2I5NzE3ZmI0YzgwOGZhODY1M2Q0YjQ1MmQxMyIsInVzZXJfaWQiOiIyIn0.IH0j3wuknyGnmFZZdL81_Gk5nD9zshgq3yxEhSlqYOY	2026-04-01 16:04:09.668219+00	2026-04-08 16:04:09+00	2	1f543b9717fb4c808fa8653d4b452d13
358	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3MzIxOCwiaWF0IjoxNzc1MDY4NDE4LCJqdGkiOiI5NjlkNzM5NjU2YWE0NmEzYTM3YWRiYmE5NGRhNjFmZiIsInVzZXJfaWQiOiIyIn0.dFVXxaWbmW9nGPNvY0g783hIIqqevidAOzqtyq7RB9o	2026-04-01 18:33:38.491355+00	2026-04-08 18:33:38+00	2	969d739656aa46a3a37adbba94da61ff
359	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3NTAxOSwiaWF0IjoxNzc1MDcwMjE5LCJqdGkiOiJmOWE0NTUzYjZkNzE0NDg0OWJjNTVhMWU0YTU0YzkzZSIsInVzZXJfaWQiOiIyIn0.Ie8OgSYnpX-W5TH2TSuIjPfVu-qVtp0GTjEz6jTui7c	2026-04-01 19:03:39.158063+00	2026-04-08 19:03:39+00	2	f9a4553b6d7144849bc55a1e4a54c93e
360	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3NTE2OSwiaWF0IjoxNzc1MDcwMzY5LCJqdGkiOiI4MTUwNGY2MjIxZTg0NjBiYjYyNTZmODY5ZTNmODM2ZSIsInVzZXJfaWQiOiIyIn0.LC2Mp7ppkYoaa7sTl00aTJPyGAHInxmXqP9BLWGu0fk	2026-04-01 19:06:09.98626+00	2026-04-08 19:06:09+00	2	81504f6221e8460bb6256f869e3f836e
361	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3Njk2OSwiaWF0IjoxNzc1MDcyMTY5LCJqdGkiOiJmYzQ2MWVmODFlODU0YWY3OTMxMmY4ODczMTg4NWNmNCIsInVzZXJfaWQiOiIyIn0.QTda9dOIqLuG2nNLrzVcfaXgNAh_B3EbRI8DaajPFUM	2026-04-01 19:36:09.267517+00	2026-04-08 19:36:09+00	2	fc461ef81e854af79312f88731885cf4
362	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3Njk2OSwiaWF0IjoxNzc1MDcyMTY5LCJqdGkiOiIyNzBlOTA1YzdlNTM0MjZlOTYzNTE5OGM4MDU5Y2NhNSIsInVzZXJfaWQiOiIyIn0.gy5RnO0KjJtGDvI3F4_FAAbePeTdgddk-bSLMmTdUkE	2026-04-01 19:36:09.542654+00	2026-04-08 19:36:09+00	2	270e905c7e53426e9635198c8059cca5
363	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3NzQxMywiaWF0IjoxNzc1MDcyNjEzLCJqdGkiOiI3YTNmYzVmZGMxYTE0Nzc1OGMxY2UyYTQ1ZGQ5MDFmMiIsInVzZXJfaWQiOiIyIn0.UxxAGNvcPaVAu2A9e-JuDsru36dJF2bv2_1hT16gC-8	2026-04-01 19:43:33.81328+00	2026-04-08 19:43:33+00	2	7a3fc5fdc1a147758c1ce2a45dd901f2
364	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3OTIxMywiaWF0IjoxNzc1MDc0NDEzLCJqdGkiOiIzMzY4MGUyYzMyZGU0OTM2OTA2NmNlODIxNzIyYTJkMiIsInVzZXJfaWQiOiIyIn0.GWgpCKBTQ_tVlqYISp69xmz4ntnUaf5kOsdL3oeB31g	2026-04-01 20:13:33.325577+00	2026-04-08 20:13:33+00	2	33680e2c32de49369066ce821722a2d2
365	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3OTIxMywiaWF0IjoxNzc1MDc0NDEzLCJqdGkiOiI3MzhjZjdlYzk4MjU0ZmVkOGE2YzE5ODI5ODMyNzc0MSIsInVzZXJfaWQiOiIyIn0.Bjtr18_pmZdLuCM7ZiEsc9YuwwRM5UmyQq6QWKLuXIc	2026-04-01 20:13:33.319121+00	2026-04-08 20:13:33+00	2	738cf7ec98254fed8a6c198298327741
366	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3OTIxMywiaWF0IjoxNzc1MDc0NDEzLCJqdGkiOiI0OTA2NTk2MDkzNTE0ZjYyODk0ZjdjOTM5NzVjMzAyMCIsInVzZXJfaWQiOiIyIn0.x9wB9y37g3Z3h4GIsqOC3XOPiArOHUE6PnLuDCDWzUU	2026-04-01 20:13:33.324655+00	2026-04-08 20:13:33+00	2	4906596093514f62894f7c93975c3020
367	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4MzcxMSwiaWF0IjoxNzc1MDc4OTExLCJqdGkiOiIwZjFhYTMxMmQwNzU0ODBjYmRjNWU2NGQzMWQzZmMyZCIsInVzZXJfaWQiOiIyIn0.7Ritl9Clme-jqbrFSsYs6nCauFKcKXtLCe2GDrGSkko	2026-04-01 21:28:31.543809+00	2026-04-08 21:28:31+00	2	0f1aa312d075480cbdc5e64d31d3fc2d
368	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4Mzc2MCwiaWF0IjoxNzc1MDc4OTYwLCJqdGkiOiI4MWY4YWVmMWIwNzE0MDM1OWE3NjUzNzNlZDlkMTc4OCIsInVzZXJfaWQiOiIzIn0.QQlBkyUlKbpBSuxxSWYB8xiHv07hR_EVc6yle1ToU48	2026-04-01 21:29:20.740683+00	2026-04-08 21:29:20+00	3	81f8aef1b07140359a765373ed9d1788
369	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4Mzc5MCwiaWF0IjoxNzc1MDc4OTkwLCJqdGkiOiJkOGM1ZDA5MDc4MGI0MmVhOTM4MWE1YTI5YjU5YTViNCIsInVzZXJfaWQiOiIzIn0.xjwfosn3b4nRRBI_gmQU6uOoW2_0HZZWOZKC_-9xlQc	2026-04-01 21:29:50.592813+00	2026-04-08 21:29:50+00	3	d8c5d090780b42ea9381a5a29b59a5b4
370	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4NDI5MSwiaWF0IjoxNzc1MDc5NDkxLCJqdGkiOiJkZTg5NTQ1NGQ0ZTU0M2UyYTYxMWY1ZTgzNWExZjBkNyIsInVzZXJfaWQiOiIyIn0.lXpaWSaMfDU_T3QgBWAt7RsNJBmvZP51b2dqJYU5QYY	2026-04-01 21:38:11.280622+00	2026-04-08 21:38:11+00	2	de895454d4e543e2a611f5e835a1f0d7
235	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjMwMiwiaWF0IjoxNzc0ODc3NTAyLCJqdGkiOiIyOTI5MWQ5MzkxNWI0NmM1YWIyNGY5NGM3ZDg3Yjk5MyIsInVzZXJfaWQiOiIyOCJ9.kHSM5BoRsLQxX1b6ypzRKP6nFUUaV_sC91B75K35h9w	2026-03-30 13:31:42.681964+00	2026-04-06 13:31:42+00	\N	29291d93915b46c5ab24f94c7d87b993
236	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQ4MjMyMywiaWF0IjoxNzc0ODc3NTIzLCJqdGkiOiJkNGJkNzVhZTgwOTM0YjI1OTljZDBmMWU5ZWJkNzJiOSIsInVzZXJfaWQiOiIyOCJ9.1117UDyB7E0pf4zKWPR83T7CA8gSTWNmNsuoTBqRfn0	2026-03-30 13:32:03.923461+00	2026-04-06 13:32:03+00	\N	d4bd75ae80934b2599cd0f1e9ebd72b9
371	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4NjA5MiwiaWF0IjoxNzc1MDgxMjkyLCJqdGkiOiI1YzFkZGZhODBiN2U0MGFlOWVhNzI0ODgwMTk3ZGY4YiIsInVzZXJfaWQiOiIyIn0.9JDiovJlL8OKJ3v8o6JJtPJAEiJqXdRSLZpShfZ0zl0	2026-04-01 22:08:12.083109+00	2026-04-08 22:08:12+00	2	5c1ddfa80b7e40ae9ea724880197df8b
372	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4NjU1OCwiaWF0IjoxNzc1MDgxNzU4LCJqdGkiOiJjZWFhZjI1MzhlOTQ0MTIzODNjMTZlMTQ1MjY5YjEyMCIsInVzZXJfaWQiOiIyIn0.dFqVhf7RHcfCDaDYa4v1gg3oG-d_gnB-1UEmpaNAukc	2026-04-01 22:15:58.178999+00	2026-04-08 22:15:58+00	2	ceaaf2538e94412383c16e145269b120
373	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4ODM1OCwiaWF0IjoxNzc1MDgzNTU4LCJqdGkiOiIzOTIwMzE4NGQ1OGY0NjY5OGQzNTRhM2IwNGM3MjE1NyIsInVzZXJfaWQiOiIyIn0.6bhTEcD3cGqjiuriCB6GyD0kFZb_8S8AxqSJLPc6tPY	2026-04-01 22:45:58.183242+00	2026-04-08 22:45:58+00	2	39203184d58f46698d354a3b04c72157
374	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4ODM1OCwiaWF0IjoxNzc1MDgzNTU4LCJqdGkiOiJiNzVkYjNlZmZhMTU0MDVmYjhjN2RiMjlmNjBkZmUxZCIsInVzZXJfaWQiOiIyIn0.9kAaD32VvH9PZr9oj0dZ9cReNOwi4Q-lhUwthwHW3E8	2026-04-01 22:45:58.192314+00	2026-04-08 22:45:58+00	2	b75db3effa15405fb8c7db29f60dfe1d
375	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY4ODc4MSwiaWF0IjoxNzc1MDgzOTgxLCJqdGkiOiI4Y2QxZjA0NzUzNDI0NDEwYWMyYmViNDExODAzNjg5NSIsInVzZXJfaWQiOiIyIn0.047mjgapW9IdBOu0r_HpZP-vpcmgpPPfdmGlp5NQp2s	2026-04-01 22:53:01.185004+00	2026-04-08 22:53:01+00	2	8cd1f04753424410ac2beb4118036895
376	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5MTM1MCwiaWF0IjoxNzc1MDg2NTUwLCJqdGkiOiJjYmY5ZTM5ZTY0NmU0ZTI1ODI0NmQ0NGU0MDhmYmY5YSIsInVzZXJfaWQiOiIyIn0.qkQyUILt2kkwfL-dzzI_rptj1XC-EEPyBZKsTfgcfoQ	2026-04-01 23:35:50.387781+00	2026-04-08 23:35:50+00	2	cbf9e39e646e4e258246d44e408fbf9a
377	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5MTM1OCwiaWF0IjoxNzc1MDg2NTU4LCJqdGkiOiI2NDEwZTA2MWIzMmE0YWEyOGY0Mjg1YTM4MGQ4NzcyMCIsInVzZXJfaWQiOiIyIn0.aeBNhUjvSL501hCG0Y1NVL3M6M6irMoYSv_ugCG-hz4	2026-04-01 23:35:58.351711+00	2026-04-08 23:35:58+00	2	6410e061b32a4aa28f4285a380d87720
378	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5MzY1MywiaWF0IjoxNzc1MDg4ODUzLCJqdGkiOiJlNmY1MmI5M2M5NTI0NGJhOWQ2Mjk5MzRhNWY3ZDAzMCIsInVzZXJfaWQiOiIyIn0.Vb7gG9Yr2flSsFxHQhzixOqyR2ir9Js8LwtlrdTUudI	2026-04-02 00:14:13.64198+00	2026-04-09 00:14:13+00	2	e6f52b93c95244ba9d629934a5f7d030
379	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5NTYxNSwiaWF0IjoxNzc1MDkwODE1LCJqdGkiOiI4MmU2NGVkNjZmM2U0MGQ3OTI5MjBlNmY5MzAyZTQ5OSIsInVzZXJfaWQiOiIyIn0.3iNitQq47KkWGQ-EMFlDChQc3jAwBlr_ixoL-yDoUys	2026-04-02 00:46:55.358394+00	2026-04-09 00:46:55+00	2	82e64ed66f3e40d792920e6f9302e499
380	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5NTYxNSwiaWF0IjoxNzc1MDkwODE1LCJqdGkiOiIzNjNhMGQ5ODY1Y2Y0NzAyODAxODZlODViOTE3NzFhOSIsInVzZXJfaWQiOiIyIn0.u7nLbv2Sc1sn1X5MYUKREXd-F1b3Ipb-JfcPq3G2wY4	2026-04-02 00:46:55.349487+00	2026-04-09 00:46:55+00	2	363a0d9865cf470280186e85b91771a9
381	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5NTYyMSwiaWF0IjoxNzc1MDkwODIxLCJqdGkiOiJmNDNjZTBjMmY3OGY0ZDM3OTM1YmNkNDMzMmUxZjMxZSIsInVzZXJfaWQiOiIyIn0.JP09NI9bOHoUQuvBJ3ode7IPdDnjHgPVYAsrXiTnkbE	2026-04-02 00:47:01.199189+00	2026-04-09 00:47:01+00	2	f43ce0c2f78f4d37935bcd4332e1f31e
382	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5NzQ1NywiaWF0IjoxNzc1MDkyNjU3LCJqdGkiOiI3OTBjYmFjMDJhNzU0M2JkYjQ1NmFlNWQzNGU1MzIyNyIsInVzZXJfaWQiOiIyIn0.mcrnKRLHbKM4-jlaPYhGLWx30Nn-fKSXz9eTQD2MCO4	2026-04-02 01:17:37.522968+00	2026-04-09 01:17:37+00	2	790cbac02a7543bdb456ae5d34e53227
383	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5ODEzMCwiaWF0IjoxNzc1MDkzMzMwLCJqdGkiOiIxMDg5NTQxYTkwYzc0NWI5YjgwOGYxNDAwZmUzZjhkMCIsInVzZXJfaWQiOiIxIn0.Y9qZuL2uxeitTtO7UVlysvvsKQyl6t8k5A4GOGQy3oc	2026-04-02 01:28:50.138232+00	2026-04-09 01:28:50+00	1	1089541a90c745b9b808f1400fe3f8d0
384	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5ODE2MSwiaWF0IjoxNzc1MDkzMzYxLCJqdGkiOiJlMjhjZTAwOWNmNTQ0YTFmOWUxZDE4Y2ZjZDdiYmEwMiIsInVzZXJfaWQiOiIyIn0.0cXAvX9L-TggCmpY871RnLxycPqZMs3P5zXXFW6A5_A	2026-04-02 01:29:21.771031+00	2026-04-09 01:29:21+00	2	e28ce009cf544a1f9e1d18cfcd7bba02
385	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5OTU2NSwiaWF0IjoxNzc1MDk0NzY1LCJqdGkiOiJiYjkyNmM1NWZmNDY0Y2IyODg4NmQ2NmY3MTQwMzlmNyIsInVzZXJfaWQiOiIyIn0.nO2Go5eqGxsHlprErdPSV6XU4-LlPx30_JPlhFBiCAs	2026-04-02 01:52:45.057977+00	2026-04-09 01:52:45+00	2	bb926c55ff464cb28886d66f714039f7
386	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5OTU2NSwiaWF0IjoxNzc1MDk0NzY1LCJqdGkiOiIwOGM5YmJhZjU4ODg0NTgyOWMxNjNjZjFiMWY0Y2UxOSIsInVzZXJfaWQiOiIyIn0.uh-G9C7VZeTGNnlA9A6c5ZKuassPsX-A_fe1xQLCkKA	2026-04-02 01:52:45.063321+00	2026-04-09 01:52:45+00	2	08c9bbaf588845829c163cf1b1f4ce19
387	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY5OTU3MCwiaWF0IjoxNzc1MDk0NzcwLCJqdGkiOiIyNzc5ZGQ1YjdkNDA0YzM2OGFmMTdkYjE3MWNkNTIyMyIsInVzZXJfaWQiOiIyIn0.dSV9PhdEP09G48kftRdAXvQtiF56cszL2lehThoO9lA	2026-04-02 01:52:50.631275+00	2026-04-09 01:52:50+00	2	2779dd5b7d404c368af17db171cd5223
388	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwMTQxOCwiaWF0IjoxNzc1MDk2NjE4LCJqdGkiOiJhMWMwOWY2MDQ0NmE0MzI0YmU0MTdmMWFiMzc0NDdkNCIsInVzZXJfaWQiOiIyIn0.XXBTdxUu1a1qq8aYSAXfFF85T-ORnFzsFq1jjDQl9Xs	2026-04-02 02:23:38.820377+00	2026-04-09 02:23:38+00	2	a1c09f60446a4324be417f1ab37447d4
389	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwMzgwNywiaWF0IjoxNzc1MDk5MDA3LCJqdGkiOiIyMWFkNmRmZTFhMTk0NzJiOTlhMTFmNWY4YTA1ZTVkNSIsInVzZXJfaWQiOiIyIn0.uQ38HUCdgJiCDjUqR9mw5jO_2aK_Laz-pObmrCyvv0w	2026-04-02 03:03:27.204786+00	2026-04-09 03:03:27+00	2	21ad6dfe1a19472b99a11f5f8a05e5d5
392	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwNDM4NCwiaWF0IjoxNzc1MDk5NTg0LCJqdGkiOiJiN2EwMjAxOGM0MWE0YWZjOWQyM2IxNWJhYmY4OTczOCIsInVzZXJfaWQiOiIyIn0.x1gwRZrNCP-xMRCb5-cWNechk9tNg24EnKT4D4DtokU	2026-04-02 03:13:04.137704+00	2026-04-09 03:13:04+00	2	b7a02018c41a4afc9d23b15babf89738
395	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc1NTI0NiwiaWF0IjoxNzc1MTUwNDQ2LCJqdGkiOiJiNzliZTk2ODlmM2Y0YzQwYWZiNTEwNjk4MzQ3NjdhNCIsInVzZXJfaWQiOiIzIn0.3g9U24TJF2sCHfedafEI6y7Ax2vTKjQp7hqpKh0MxAs	2026-04-02 17:20:46.163921+00	2026-04-09 17:20:46+00	3	b79be9689f3f4c40afb51069834767a4
398	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc2NDQ0NSwiaWF0IjoxNzc1MTU5NjQ1LCJqdGkiOiI2ZTE1MmJjOWM0MjU0NzA1OGQ1MTk5M2U5YjNkYzM2NyIsInVzZXJfaWQiOiIyIn0.mApFCEWPyNzrRhqMn4LVh2wySsPD0pk9XnAFdgO5FD8	2026-04-02 19:54:05.185787+00	2026-04-09 19:54:05+00	2	6e152bc9c42547058d51993e9b3dc367
400	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc2NzMzMiwiaWF0IjoxNzc1MTYyNTMyLCJqdGkiOiIyOTQ3YmY4YzRiMDI0ZmY2YjljYzA1OWIyMDhhMDAwOCIsInVzZXJfaWQiOiIzIn0.AjvY-rOheDlPteqkxvrWWQtMEeQvlYJTJq89W-yqSwM	2026-04-02 20:42:12.084884+00	2026-04-09 20:42:12+00	3	2947bf8c4b024ff6b9cc059b208a0008
390	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwMzgwOCwiaWF0IjoxNzc1MDk5MDA4LCJqdGkiOiIxMWMyNTJjMzQzOTg0ZDc5ODgwMjEyMGIxMGFiZjJlOSIsInVzZXJfaWQiOiIyIn0.mVwLcsfwKGuqO9GORnVj_D6bX0dUTbrzl2S--O-9aj4	2026-04-02 03:03:28.164212+00	2026-04-09 03:03:28+00	2	11c252c343984d798802120b10abf2e9
393	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwNDM4NCwiaWF0IjoxNzc1MDk5NTg0LCJqdGkiOiIyYjVlMmE3MDY2OGM0Njc5OTNiYTUyZjFkNTU1ZDVlZiIsInVzZXJfaWQiOiIyIn0.gNEaR6T5g8-fnUn08k7Fl6wsWuLO4KegBjhOCNyJ6lY	2026-04-02 03:13:04.119808+00	2026-04-09 03:13:04+00	2	2b5e2a70668c467993ba52f1d555d5ef
396	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc1NTI3MSwiaWF0IjoxNzc1MTUwNDcxLCJqdGkiOiJmMGE3YjAxYzkyODk0MTRhOTFjY2E5NjVhYzI1NjkxMiIsInVzZXJfaWQiOiIzIn0.dsMd3K5m4imvexrcw0aYrGYmD4U7_wEO1AhkjgBovIM	2026-04-02 17:21:11.575735+00	2026-04-09 17:21:11+00	3	f0a7b01c9289414a91cca965ac256912
399	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc2NDQ1MiwiaWF0IjoxNzc1MTU5NjUyLCJqdGkiOiJlMjcxNDU3ZDVlYzI0NWVjYjZjMmY3MDY3MzZmMTcyOSIsInVzZXJfaWQiOiIyIn0.nEXQJiHRmLTtESPpk-9X_aw9Nt4SjuX2WHJB13x_xag	2026-04-02 19:54:12.641174+00	2026-04-09 19:54:12+00	2	e271457d5ec245ecb6c2f706736f1729
401	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc3MjM1MiwiaWF0IjoxNzc1MTY3NTUyLCJqdGkiOiJkNjI5MDhkZDBjODY0YmE4OThjNGVjNGRjYzdjMzkyYyIsInVzZXJfaWQiOiIyIn0._LZ_D7mrKdB9FIHcR2u4ckv2msqq5-xX2Srqe3crypQ	2026-04-02 22:05:52.288471+00	2026-04-09 22:05:52+00	2	d62908dd0c864ba898c4ec4dcc7c392c
391	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwMzgxMywiaWF0IjoxNzc1MDk5MDEzLCJqdGkiOiI1OTU1YjdiODdhYzY0N2I3ODAzZjJjYzVmOWU0ZGMyNyIsInVzZXJfaWQiOiIyIn0.7gp1XMWJHpWpycpb-oz8TNjNP9p9Cb3Xsh99ruL7r3s	2026-04-02 03:03:33.486472+00	2026-04-09 03:03:33+00	2	5955b7b87ac647b7803f2cc5f9e4dc27
394	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTcwNDM4NCwiaWF0IjoxNzc1MDk5NTg0LCJqdGkiOiI4NWE0Mjg0YjdiNDM0NWYxYjE5MDBlODdiZWQ1NDllYyIsInVzZXJfaWQiOiIyIn0.dOfJvHucTCknPcwzhpR_Ljz7Ew-tUb5v9iXBVAjhSic	2026-04-02 03:13:04.127772+00	2026-04-09 03:13:04+00	2	85a4284b7b4345f1b1900e87bed549ec
397	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc2NDQ0NSwiaWF0IjoxNzc1MTU5NjQ1LCJqdGkiOiI2NmIxMGRhMGY4YzY0Y2Y3Yjc4YzUzYWM2NjZlMTY3NCIsInVzZXJfaWQiOiIyIn0.7dd1QMUgLO29ithjIEzu_iA6vsUpNWbqMSLn__QECK0	2026-04-02 19:54:05.18698+00	2026-04-09 19:54:05+00	2	66b10da0f8c64cf7b78c53ac666e1674
402	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTc3MjM1MiwiaWF0IjoxNzc1MTY3NTUyLCJqdGkiOiIyZjlhMGViNWIxMTE0ODk1YjYxMmQyYWU3YWViNTI4YSIsInVzZXJfaWQiOiIyIn0.XpAhZlPJ89MMnWA2NBHk2Qe2pMx10w4xik5RXXw1tAA	2026-04-02 22:05:52.296112+00	2026-04-09 22:05:52+00	2	2f9a0eb5b1114895b612d2ae7aeb528a
\.


--
-- Name: analitica_catalogoevento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analitica_catalogoevento_id_seq', 14, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 152, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 31, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: catalogo_categoriamoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogo_categoriamoto_id_seq', 7, true);


--
-- Name: catalogo_categoriaproducto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogo_categoriaproducto_id_seq', 2, true);


--
-- Name: catalogo_marca_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogo_marca_id_seq', 16, true);


--
-- Name: catalogo_subcategoriaproducto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogo_subcategoriaproducto_id_seq', 20, true);


--
-- Name: clientes_contactocliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clientes_contactocliente_id_seq', 1, false);


--
-- Name: clientes_perfilusuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clientes_perfilusuario_id_seq', 22, true);


--
-- Name: core_auditlog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.core_auditlog_id_seq', 158, true);


--
-- Name: core_contactositio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.core_contactositio_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 38, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 120, true);


--
-- Name: mantenciones_horariomantencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_horariomantencion_id_seq', 1, false);


--
-- Name: mantenciones_mantencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_mantencion_id_seq', 1, false);


--
-- Name: mantenciones_mantenciondiabloqueado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_mantenciondiabloqueado_id_seq', 1, false);


--
-- Name: mantenciones_mantencionestadohistorial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_mantencionestadohistorial_id_seq', 1, false);


--
-- Name: mantenciones_mantencionhorabloqueada_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_mantencionhorabloqueada_id_seq', 1, false);


--
-- Name: mantenciones_mantencionhorariofecha_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_mantencionhorariofecha_id_seq', 1, false);


--
-- Name: mantenciones_vehiculocliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantenciones_vehiculocliente_id_seq', 1, false);


--
-- Name: motos_especificacionmoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_especificacionmoto_id_seq', 1, false);


--
-- Name: motos_imagenmoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_imagenmoto_id_seq', 3, true);


--
-- Name: motos_itemfichatecnica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_itemfichatecnica_id_seq', 1, false);


--
-- Name: motos_modelomoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_modelomoto_id_seq', 17, true);


--
-- Name: motos_moto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_moto_id_seq', 18, true);


--
-- Name: motos_seccionfichatecnica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_seccionfichatecnica_id_seq', 1, false);


--
-- Name: motos_tipoatributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_tipoatributo_id_seq', 4, true);


--
-- Name: motos_valoratributomoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.motos_valoratributomoto_id_seq', 1920, true);


--
-- Name: productos_compatibilidadproductomoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_compatibilidadproductomoto_id_seq', 3, true);


--
-- Name: productos_especificacionproducto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_especificacionproducto_id_seq', 1, false);


--
-- Name: productos_imagenproducto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_imagenproducto_id_seq', 28, true);


--
-- Name: productos_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_producto_id_seq', 63, true);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_blacklistedtoken_id_seq', 199, true);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_outstandingtoken_id_seq', 402, true);


--
-- Name: analitica_catalogoevento analitica_catalogoevento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analitica_catalogoevento
    ADD CONSTRAINT analitica_catalogoevento_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- Name: catalogo_categoriamoto catalogo_categoriamoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_categoriamoto
    ADD CONSTRAINT catalogo_categoriamoto_pkey PRIMARY KEY (id);


--
-- Name: catalogo_categoriamoto catalogo_categoriamoto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_categoriamoto
    ADD CONSTRAINT catalogo_categoriamoto_slug_key UNIQUE (slug);


--
-- Name: catalogo_categoriaproducto catalogo_categoriaproducto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_categoriaproducto
    ADD CONSTRAINT catalogo_categoriaproducto_pkey PRIMARY KEY (id);


--
-- Name: catalogo_categoriaproducto catalogo_categoriaproducto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_categoriaproducto
    ADD CONSTRAINT catalogo_categoriaproducto_slug_key UNIQUE (slug);


--
-- Name: catalogo_marca catalogo_marca_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_marca
    ADD CONSTRAINT catalogo_marca_pkey PRIMARY KEY (id);


--
-- Name: catalogo_marca catalogo_marca_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_marca
    ADD CONSTRAINT catalogo_marca_slug_key UNIQUE (slug);


--
-- Name: catalogo_subcategoriaproducto catalogo_subcategoriaproducto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_subcategoriaproducto
    ADD CONSTRAINT catalogo_subcategoriaproducto_pkey PRIMARY KEY (id);


--
-- Name: catalogo_subcategoriaproducto catalogo_subcategoriaproducto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_subcategoriaproducto
    ADD CONSTRAINT catalogo_subcategoriaproducto_slug_key UNIQUE (slug);


--
-- Name: clientes_contactocliente clientes_contactocliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_contactocliente
    ADD CONSTRAINT clientes_contactocliente_pkey PRIMARY KEY (id);


--
-- Name: clientes_perfilusuario clientes_perfilusuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_perfilusuario
    ADD CONSTRAINT clientes_perfilusuario_pkey PRIMARY KEY (id);


--
-- Name: clientes_perfilusuario clientes_perfilusuario_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_perfilusuario
    ADD CONSTRAINT clientes_perfilusuario_user_id_key UNIQUE (user_id);


--
-- Name: core_auditlog core_auditlog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_auditlog
    ADD CONSTRAINT core_auditlog_pkey PRIMARY KEY (id);


--
-- Name: core_contactositio core_contactositio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_contactositio
    ADD CONSTRAINT core_contactositio_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: mantenciones_horariomantencion mantenciones_horariomantencion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_horariomantencion
    ADD CONSTRAINT mantenciones_horariomantencion_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantencion mantenciones_mantencion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencion
    ADD CONSTRAINT mantenciones_mantencion_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantenciondiabloqueado mantenciones_mantenciondiabloqueado_fecha_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantenciondiabloqueado
    ADD CONSTRAINT mantenciones_mantenciondiabloqueado_fecha_key UNIQUE (fecha);


--
-- Name: mantenciones_mantenciondiabloqueado mantenciones_mantenciondiabloqueado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantenciondiabloqueado
    ADD CONSTRAINT mantenciones_mantenciondiabloqueado_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantencionestadohistorial mantenciones_mantencionestadohistorial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionestadohistorial
    ADD CONSTRAINT mantenciones_mantencionestadohistorial_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantencionhorabloqueada mantenciones_mantencionhorabloqueada_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionhorabloqueada
    ADD CONSTRAINT mantenciones_mantencionhorabloqueada_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantencionhorariofecha mantenciones_mantencionhorariofecha_fecha_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionhorariofecha
    ADD CONSTRAINT mantenciones_mantencionhorariofecha_fecha_key UNIQUE (fecha);


--
-- Name: mantenciones_mantencionhorariofecha mantenciones_mantencionhorariofecha_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionhorariofecha
    ADD CONSTRAINT mantenciones_mantencionhorariofecha_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_vehiculocliente mantenciones_vehiculocliente_matricula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_vehiculocliente
    ADD CONSTRAINT mantenciones_vehiculocliente_matricula_key UNIQUE (matricula);


--
-- Name: mantenciones_vehiculocliente mantenciones_vehiculocliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_vehiculocliente
    ADD CONSTRAINT mantenciones_vehiculocliente_pkey PRIMARY KEY (id);


--
-- Name: motos_especificacionmoto motos_especificacionmoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_especificacionmoto
    ADD CONSTRAINT motos_especificacionmoto_pkey PRIMARY KEY (id);


--
-- Name: motos_imagenmoto motos_imagenmoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_imagenmoto
    ADD CONSTRAINT motos_imagenmoto_pkey PRIMARY KEY (id);


--
-- Name: motos_itemfichatecnica motos_itemfichatecnica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_itemfichatecnica
    ADD CONSTRAINT motos_itemfichatecnica_pkey PRIMARY KEY (id);


--
-- Name: motos_modelomoto motos_modelomoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_modelomoto
    ADD CONSTRAINT motos_modelomoto_pkey PRIMARY KEY (id);


--
-- Name: motos_modelomoto motos_modelomoto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_modelomoto
    ADD CONSTRAINT motos_modelomoto_slug_key UNIQUE (slug);


--
-- Name: motos_moto motos_moto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_moto
    ADD CONSTRAINT motos_moto_pkey PRIMARY KEY (id);


--
-- Name: motos_moto motos_moto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_moto
    ADD CONSTRAINT motos_moto_slug_key UNIQUE (slug);


--
-- Name: motos_seccionfichatecnica motos_seccionfichatecnica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_seccionfichatecnica
    ADD CONSTRAINT motos_seccionfichatecnica_pkey PRIMARY KEY (id);


--
-- Name: motos_tipoatributo motos_tipoatributo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_tipoatributo
    ADD CONSTRAINT motos_tipoatributo_pkey PRIMARY KEY (id);


--
-- Name: motos_tipoatributo motos_tipoatributo_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_tipoatributo
    ADD CONSTRAINT motos_tipoatributo_slug_key UNIQUE (slug);


--
-- Name: motos_valoratributomoto motos_valoratributomoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_valoratributomoto
    ADD CONSTRAINT motos_valoratributomoto_pkey PRIMARY KEY (id);


--
-- Name: productos_compatibilidadproductomoto productos_compatibilidadproductomoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_compatibilidadproductomoto
    ADD CONSTRAINT productos_compatibilidadproductomoto_pkey PRIMARY KEY (id);


--
-- Name: productos_especificacionproducto productos_especificacionproducto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_especificacionproducto
    ADD CONSTRAINT productos_especificacionproducto_pkey PRIMARY KEY (id);


--
-- Name: productos_imagenproducto productos_imagenproducto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_imagenproducto
    ADD CONSTRAINT productos_imagenproducto_pkey PRIMARY KEY (id);


--
-- Name: productos_producto productos_producto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_producto
    ADD CONSTRAINT productos_producto_pkey PRIMARY KEY (id);


--
-- Name: productos_producto productos_producto_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_producto
    ADD CONSTRAINT productos_producto_slug_key UNIQUE (slug);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_key UNIQUE (token_id);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq UNIQUE (jti);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_pkey PRIMARY KEY (id);


--
-- Name: mantenciones_mantencionhorabloqueada uniq_mant_hora_bloq_fecha_hora; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionhorabloqueada
    ADD CONSTRAINT uniq_mant_hora_bloq_fecha_hora UNIQUE (fecha, hora);


--
-- Name: productos_compatibilidadproductomoto uq_compat_producto_moto; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_compatibilidadproductomoto
    ADD CONSTRAINT uq_compat_producto_moto UNIQUE (producto_id, moto_id);


--
-- Name: motos_especificacionmoto uq_especmoto_moto_clave; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_especificacionmoto
    ADD CONSTRAINT uq_especmoto_moto_clave UNIQUE (moto_id, clave);


--
-- Name: productos_especificacionproducto uq_especprod_producto_clave; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_especificacionproducto
    ADD CONSTRAINT uq_especprod_producto_clave UNIQUE (producto_id, clave);


--
-- Name: motos_itemfichatecnica uq_itemfichatecnica_seccion_orden; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_itemfichatecnica
    ADD CONSTRAINT uq_itemfichatecnica_seccion_orden UNIQUE (seccion_id, orden);


--
-- Name: motos_modelomoto uq_modelomoto_marca_nombre_modelo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_modelomoto
    ADD CONSTRAINT uq_modelomoto_marca_nombre_modelo UNIQUE (marca_id, nombre_modelo);


--
-- Name: motos_seccionfichatecnica uq_seccionfichatecnica_moto_orden; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_seccionfichatecnica
    ADD CONSTRAINT uq_seccionfichatecnica_moto_orden UNIQUE (moto_id, orden);


--
-- Name: motos_valoratributomoto uq_valoratributomoto_moto_tipoatributo_nombre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_valoratributomoto
    ADD CONSTRAINT uq_valoratributomoto_moto_tipoatributo_nombre UNIQUE (moto_id, tipo_atributo_id, nombre);


--
-- Name: analitica_catalogoevento_entidad_slug_62514311; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analitica_catalogoevento_entidad_slug_62514311 ON public.analitica_catalogoevento USING btree (entidad_slug);


--
-- Name: analitica_catalogoevento_entidad_slug_62514311_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analitica_catalogoevento_entidad_slug_62514311_like ON public.analitica_catalogoevento USING btree (entidad_slug varchar_pattern_ops);


--
-- Name: analitica_catalogoevento_usuario_id_16f85fb0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analitica_catalogoevento_usuario_id_16f85fb0 ON public.analitica_catalogoevento USING btree (usuario_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- Name: catalogo_categoriamoto_slug_dd08a1ef_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalogo_categoriamoto_slug_dd08a1ef_like ON public.catalogo_categoriamoto USING btree (slug varchar_pattern_ops);


--
-- Name: catalogo_categoriaproducto_slug_e46c838d_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalogo_categoriaproducto_slug_e46c838d_like ON public.catalogo_categoriaproducto USING btree (slug varchar_pattern_ops);


--
-- Name: catalogo_marca_slug_cf579a2b_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalogo_marca_slug_cf579a2b_like ON public.catalogo_marca USING btree (slug varchar_pattern_ops);


--
-- Name: catalogo_subcategoriaproducto_categoria_id_de577b4f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalogo_subcategoriaproducto_categoria_id_de577b4f ON public.catalogo_subcategoriaproducto USING btree (categoria_id);


--
-- Name: catalogo_subcategoriaproducto_slug_323876e6_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalogo_subcategoriaproducto_slug_323876e6_like ON public.catalogo_subcategoriaproducto USING btree (slug varchar_pattern_ops);


--
-- Name: clientes_contactocliente_moto_id_15a41aaf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clientes_contactocliente_moto_id_15a41aaf ON public.clientes_contactocliente USING btree (moto_id);


--
-- Name: clientes_contactocliente_producto_id_7e4cd3df; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clientes_contactocliente_producto_id_7e4cd3df ON public.clientes_contactocliente USING btree (producto_id);


--
-- Name: core_auditlog_accion_3cf13ff1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_accion_3cf13ff1 ON public.core_auditlog USING btree (accion);


--
-- Name: core_auditlog_accion_3cf13ff1_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_accion_3cf13ff1_like ON public.core_auditlog USING btree (accion varchar_pattern_ops);


--
-- Name: core_auditlog_actor_id_ab091f3c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_actor_id_ab091f3c ON public.core_auditlog USING btree (actor_id);


--
-- Name: core_auditlog_entidad_1d79c7b3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_entidad_1d79c7b3 ON public.core_auditlog USING btree (entidad);


--
-- Name: core_auditlog_entidad_1d79c7b3_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_entidad_1d79c7b3_like ON public.core_auditlog USING btree (entidad varchar_pattern_ops);


--
-- Name: core_auditlog_entidad_id_aa8aa513; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_entidad_id_aa8aa513 ON public.core_auditlog USING btree (entidad_id);


--
-- Name: core_auditlog_entidad_id_aa8aa513_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_entidad_id_aa8aa513_like ON public.core_auditlog USING btree (entidad_id varchar_pattern_ops);


--
-- Name: core_auditlog_request_id_ba615c25; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_request_id_ba615c25 ON public.core_auditlog USING btree (request_id);


--
-- Name: core_auditlog_request_id_ba615c25_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_auditlog_request_id_ba615c25_like ON public.core_auditlog USING btree (request_id varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: idx_audit_accion_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_accion_fecha ON public.core_auditlog USING btree (accion, creado_en DESC);


--
-- Name: idx_audit_actor_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_actor_fecha ON public.core_auditlog USING btree (actor_id, creado_en DESC);


--
-- Name: idx_audit_entidad_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_entidad_fecha ON public.core_auditlog USING btree (entidad, entidad_id, creado_en DESC);


--
-- Name: idx_cat_event_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_event_created ON public.analitica_catalogoevento USING btree (created_at);


--
-- Name: idx_cat_event_evento_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_event_evento_fecha ON public.analitica_catalogoevento USING btree (tipo_evento, created_at);


--
-- Name: idx_cat_event_session_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_event_session_fecha ON public.analitica_catalogoevento USING btree (session_id, created_at);


--
-- Name: idx_cat_event_tipo_entidad; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_event_tipo_entidad ON public.analitica_catalogoevento USING btree (tipo_entidad, entidad_id);


--
-- Name: idx_cat_event_tipo_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_event_tipo_fecha ON public.analitica_catalogoevento USING btree (tipo_entidad, created_at);


--
-- Name: idx_catprod_activa_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catprod_activa_nombre ON public.catalogo_categoriaproducto USING btree (activa, nombre);


--
-- Name: idx_compat_moto_producto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compat_moto_producto ON public.productos_compatibilidadproductomoto USING btree (moto_id, producto_id);


--
-- Name: idx_compat_producto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compat_producto ON public.productos_compatibilidadproductomoto USING btree (producto_id);


--
-- Name: idx_contactocliente_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contactocliente_fecha ON public.clientes_contactocliente USING btree (fecha_creacion);


--
-- Name: idx_contactocliente_moto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contactocliente_moto ON public.clientes_contactocliente USING btree (moto_id);


--
-- Name: idx_contactocliente_producto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contactocliente_producto ON public.clientes_contactocliente USING btree (producto_id);


--
-- Name: idx_hist_mant_changed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hist_mant_changed_at ON public.mantenciones_mantencionestadohistorial USING btree (changed_at);


--
-- Name: idx_hist_mant_estado_nuevo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hist_mant_estado_nuevo ON public.mantenciones_mantencionestadohistorial USING btree (estado_nuevo);


--
-- Name: idx_hist_mant_mant_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hist_mant_mant_fecha ON public.mantenciones_mantencionestadohistorial USING btree (mantencion_id, changed_at);


--
-- Name: idx_imagenmoto_moto_orden; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_imagenmoto_moto_orden ON public.motos_imagenmoto USING btree (moto_id, orden);


--
-- Name: idx_imagenprod_prod_orden; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_imagenprod_prod_orden ON public.productos_imagenproducto USING btree (producto_id, orden);


--
-- Name: idx_mant_dia_bloq_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_dia_bloq_estado ON public.mantenciones_mantenciondiabloqueado USING btree (bloqueado);


--
-- Name: idx_mant_dia_bloq_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_dia_bloq_fecha ON public.mantenciones_mantenciondiabloqueado USING btree (fecha);


--
-- Name: idx_mant_hor_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_hor_fecha ON public.mantenciones_mantencionhorariofecha USING btree (fecha);


--
-- Name: idx_mant_hor_fecha_activo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_hor_fecha_activo ON public.mantenciones_mantencionhorariofecha USING btree (activo);


--
-- Name: idx_mant_hora_bloq_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_hora_bloq_estado ON public.mantenciones_mantencionhorabloqueada USING btree (bloqueado);


--
-- Name: idx_mant_hora_bloq_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mant_hora_bloq_fecha ON public.mantenciones_mantencionhorabloqueada USING btree (fecha);


--
-- Name: idx_mantencion_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_created_at ON public.mantenciones_mantencion USING btree (created_at);


--
-- Name: idx_mantencion_created_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_created_estado ON public.mantenciones_mantencion USING btree (created_at, estado);


--
-- Name: idx_mantencion_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_estado ON public.mantenciones_mantencion USING btree (estado);


--
-- Name: idx_mantencion_fecha_hora; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_fecha_hora ON public.mantenciones_mantencion USING btree (fecha_ingreso, hora_ingreso);


--
-- Name: idx_mantencion_fecha_ingreso; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_fecha_ingreso ON public.mantenciones_mantencion USING btree (fecha_ingreso);


--
-- Name: idx_mantencion_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantencion_tipo ON public.mantenciones_mantencion USING btree (tipo_mantencion);


--
-- Name: idx_marca_activa_tipo_nom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_marca_activa_tipo_nom ON public.catalogo_marca USING btree (activa, tipo, nombre);


--
-- Name: idx_modelomoto_act_marca_nom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_modelomoto_act_marca_nom ON public.motos_modelomoto USING btree (activo, marca_id, nombre_modelo);


--
-- Name: idx_moto_activa_modelo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_moto_activa_modelo ON public.motos_moto USING btree (activa, modelo);


--
-- Name: idx_moto_estado_activa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_moto_estado_activa ON public.motos_moto USING btree (estado, activa);


--
-- Name: idx_moto_home_feed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_moto_home_feed ON public.motos_moto USING btree (activa, es_destacada, orden_carrusel, id);


--
-- Name: idx_moto_marca_modelo_act; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_moto_marca_modelo_act ON public.motos_moto USING btree (marca_id, modelo_moto_id, activa);


--
-- Name: idx_perfilusuario_rol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perfilusuario_rol ON public.clientes_perfilusuario USING btree (rol);


--
-- Name: idx_producto_act_sub_marca; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_producto_act_sub_marca ON public.productos_producto USING btree (activo, subcategoria_id, marca_id);


--
-- Name: idx_producto_destacado_ord; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_producto_destacado_ord ON public.productos_producto USING btree (es_destacado, orden_carrusel, id);


--
-- Name: idx_producto_precio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_producto_precio ON public.productos_producto USING btree (precio);


--
-- Name: idx_subcat_act_cat_nom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subcat_act_cat_nom ON public.catalogo_subcategoriaproducto USING btree (activa, categoria_id, nombre);


--
-- Name: idx_valoratrib_moto_tipo_ord; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_valoratrib_moto_tipo_ord ON public.motos_valoratributomoto USING btree (moto_id, tipo_atributo_id, orden);


--
-- Name: mantenciones_mantencion_moto_cliente_id_d2f8163a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_mantencion_moto_cliente_id_d2f8163a ON public.mantenciones_mantencion USING btree (moto_cliente_id);


--
-- Name: mantenciones_mantencion_rut_cliente_03583757; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_mantencion_rut_cliente_03583757 ON public.mantenciones_mantencion USING btree (rut_cliente);


--
-- Name: mantenciones_mantencion_rut_cliente_03583757_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_mantencion_rut_cliente_03583757_like ON public.mantenciones_mantencion USING btree (rut_cliente varchar_pattern_ops);


--
-- Name: mantenciones_mantencionestadohistorial_changed_by_id_eec5f623; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_mantencionestadohistorial_changed_by_id_eec5f623 ON public.mantenciones_mantencionestadohistorial USING btree (changed_by_id);


--
-- Name: mantenciones_mantencionestadohistorial_mantencion_id_2a48a298; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_mantencionestadohistorial_mantencion_id_2a48a298 ON public.mantenciones_mantencionestadohistorial USING btree (mantencion_id);


--
-- Name: mantenciones_vehiculocliente_cliente_id_29d4e4ee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_vehiculocliente_cliente_id_29d4e4ee ON public.mantenciones_vehiculocliente USING btree (cliente_id);


--
-- Name: mantenciones_vehiculocliente_matricula_ed771e22_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mantenciones_vehiculocliente_matricula_ed771e22_like ON public.mantenciones_vehiculocliente USING btree (matricula varchar_pattern_ops);


--
-- Name: motos_especificacionmoto_moto_id_766053b3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_especificacionmoto_moto_id_766053b3 ON public.motos_especificacionmoto USING btree (moto_id);


--
-- Name: motos_imagenmoto_moto_id_a3a86a1c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_imagenmoto_moto_id_a3a86a1c ON public.motos_imagenmoto USING btree (moto_id);


--
-- Name: motos_itemfichatecnica_seccion_id_d2cc533c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_itemfichatecnica_seccion_id_d2cc533c ON public.motos_itemfichatecnica USING btree (seccion_id);


--
-- Name: motos_modelomoto_categoria_id_323ecdc7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_modelomoto_categoria_id_323ecdc7 ON public.motos_modelomoto USING btree (categoria_id);


--
-- Name: motos_modelomoto_marca_id_fc044d84; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_modelomoto_marca_id_fc044d84 ON public.motos_modelomoto USING btree (marca_id);


--
-- Name: motos_modelomoto_slug_77526682_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_modelomoto_slug_77526682_like ON public.motos_modelomoto USING btree (slug varchar_pattern_ops);


--
-- Name: motos_moto_marca_id_bc0a51d0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_moto_marca_id_bc0a51d0 ON public.motos_moto USING btree (marca_id);


--
-- Name: motos_moto_modelo_moto_id_e27e75bd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_moto_modelo_moto_id_e27e75bd ON public.motos_moto USING btree (modelo_moto_id);


--
-- Name: motos_moto_slug_cb5ee6e2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_moto_slug_cb5ee6e2_like ON public.motos_moto USING btree (slug varchar_pattern_ops);


--
-- Name: motos_seccionfichatecnica_moto_id_c24967de; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_seccionfichatecnica_moto_id_c24967de ON public.motos_seccionfichatecnica USING btree (moto_id);


--
-- Name: motos_tipoatributo_slug_d6c9bef1_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_tipoatributo_slug_d6c9bef1_like ON public.motos_tipoatributo USING btree (slug varchar_pattern_ops);


--
-- Name: motos_valoratributomoto_moto_id_950f691e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_valoratributomoto_moto_id_950f691e ON public.motos_valoratributomoto USING btree (moto_id);


--
-- Name: motos_valoratributomoto_tipo_atributo_id_4116b968; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX motos_valoratributomoto_tipo_atributo_id_4116b968 ON public.motos_valoratributomoto USING btree (tipo_atributo_id);


--
-- Name: productos_compatibilidadproductomoto_moto_id_da92d417; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_compatibilidadproductomoto_moto_id_da92d417 ON public.productos_compatibilidadproductomoto USING btree (moto_id);


--
-- Name: productos_compatibilidadproductomoto_producto_id_ba87c192; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_compatibilidadproductomoto_producto_id_ba87c192 ON public.productos_compatibilidadproductomoto USING btree (producto_id);


--
-- Name: productos_especificacionproducto_producto_id_2262c53b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_especificacionproducto_producto_id_2262c53b ON public.productos_especificacionproducto USING btree (producto_id);


--
-- Name: productos_imagenproducto_producto_id_685baa36; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_imagenproducto_producto_id_685baa36 ON public.productos_imagenproducto USING btree (producto_id);


--
-- Name: productos_producto_marca_id_fc6a9dea; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_producto_marca_id_fc6a9dea ON public.productos_producto USING btree (marca_id);


--
-- Name: productos_producto_slug_8e5f75e2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_producto_slug_8e5f75e2_like ON public.productos_producto USING btree (slug varchar_pattern_ops);


--
-- Name: productos_producto_subcategoria_id_3e19f3d9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX productos_producto_subcategoria_id_3e19f3d9 ON public.productos_producto USING btree (subcategoria_id);


--
-- Name: token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_user_id_83bc629a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);


--
-- Name: uniq_mantencion_activa_por_moto_slot; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_mantencion_activa_por_moto_slot ON public.mantenciones_mantencion USING btree (moto_cliente_id, fecha_ingreso, hora_ingreso) WHERE ((hora_ingreso IS NOT NULL) AND ((estado)::text = ANY (ARRAY[('solicitud'::character varying)::text, ('aprobado'::character varying)::text, ('en_proceso'::character varying)::text, ('en_espera'::character varying)::text, ('finalizado'::character varying)::text])));


--
-- Name: uq_producto_semantic_marca; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_producto_semantic_marca ON public.productos_producto USING btree (lower((nombre)::text), subcategoria_id, marca_id) WHERE (marca_id IS NOT NULL);


--
-- Name: uq_producto_semantic_nomarca; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_producto_semantic_nomarca ON public.productos_producto USING btree (lower((nombre)::text), subcategoria_id) WHERE (marca_id IS NULL);


--
-- Name: analitica_catalogoevento analitica_catalogoevento_usuario_id_16f85fb0_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analitica_catalogoevento
    ADD CONSTRAINT analitica_catalogoevento_usuario_id_16f85fb0_fk_auth_user_id FOREIGN KEY (usuario_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: catalogo_subcategoriaproducto catalogo_subcategori_categoria_id_de577b4f_fk_catalogo_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_subcategoriaproducto
    ADD CONSTRAINT catalogo_subcategori_categoria_id_de577b4f_fk_catalogo_ FOREIGN KEY (categoria_id) REFERENCES public.catalogo_categoriaproducto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: clientes_contactocliente clientes_contactocli_producto_id_7e4cd3df_fk_productos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_contactocliente
    ADD CONSTRAINT clientes_contactocli_producto_id_7e4cd3df_fk_productos FOREIGN KEY (producto_id) REFERENCES public.productos_producto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: clientes_contactocliente clientes_contactocliente_moto_id_15a41aaf_fk_motos_moto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_contactocliente
    ADD CONSTRAINT clientes_contactocliente_moto_id_15a41aaf_fk_motos_moto_id FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: clientes_perfilusuario clientes_perfilusuario_user_id_5e5dcb6d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_perfilusuario
    ADD CONSTRAINT clientes_perfilusuario_user_id_5e5dcb6d_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_auditlog core_auditlog_actor_id_ab091f3c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_auditlog
    ADD CONSTRAINT core_auditlog_actor_id_ab091f3c_fk_auth_user_id FOREIGN KEY (actor_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mantenciones_mantencionestadohistorial mantenciones_mantenc_changed_by_id_eec5f623_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionestadohistorial
    ADD CONSTRAINT mantenciones_mantenc_changed_by_id_eec5f623_fk_auth_user FOREIGN KEY (changed_by_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mantenciones_mantencionestadohistorial mantenciones_mantenc_mantencion_id_2a48a298_fk_mantencio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencionestadohistorial
    ADD CONSTRAINT mantenciones_mantenc_mantencion_id_2a48a298_fk_mantencio FOREIGN KEY (mantencion_id) REFERENCES public.mantenciones_mantencion(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mantenciones_mantencion mantenciones_mantenc_moto_cliente_id_d2f8163a_fk_mantencio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_mantencion
    ADD CONSTRAINT mantenciones_mantenc_moto_cliente_id_d2f8163a_fk_mantencio FOREIGN KEY (moto_cliente_id) REFERENCES public.mantenciones_vehiculocliente(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mantenciones_vehiculocliente mantenciones_vehicul_cliente_id_29d4e4ee_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantenciones_vehiculocliente
    ADD CONSTRAINT mantenciones_vehicul_cliente_id_29d4e4ee_fk_auth_user FOREIGN KEY (cliente_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_especificacionmoto motos_especificacionmoto_moto_id_766053b3_fk_motos_moto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_especificacionmoto
    ADD CONSTRAINT motos_especificacionmoto_moto_id_766053b3_fk_motos_moto_id FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_imagenmoto motos_imagenmoto_moto_id_a3a86a1c_fk_motos_moto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_imagenmoto
    ADD CONSTRAINT motos_imagenmoto_moto_id_a3a86a1c_fk_motos_moto_id FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_itemfichatecnica motos_itemfichatecni_seccion_id_d2cc533c_fk_motos_sec; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_itemfichatecnica
    ADD CONSTRAINT motos_itemfichatecni_seccion_id_d2cc533c_fk_motos_sec FOREIGN KEY (seccion_id) REFERENCES public.motos_seccionfichatecnica(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_modelomoto motos_modelomoto_categoria_id_323ecdc7_fk_catalogo_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_modelomoto
    ADD CONSTRAINT motos_modelomoto_categoria_id_323ecdc7_fk_catalogo_ FOREIGN KEY (categoria_id) REFERENCES public.catalogo_categoriamoto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_modelomoto motos_modelomoto_marca_id_fc044d84_fk_catalogo_marca_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_modelomoto
    ADD CONSTRAINT motos_modelomoto_marca_id_fc044d84_fk_catalogo_marca_id FOREIGN KEY (marca_id) REFERENCES public.catalogo_marca(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_moto motos_moto_marca_id_bc0a51d0_fk_catalogo_marca_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_moto
    ADD CONSTRAINT motos_moto_marca_id_bc0a51d0_fk_catalogo_marca_id FOREIGN KEY (marca_id) REFERENCES public.catalogo_marca(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_moto motos_moto_modelo_moto_id_e27e75bd_fk_motos_modelomoto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_moto
    ADD CONSTRAINT motos_moto_modelo_moto_id_e27e75bd_fk_motos_modelomoto_id FOREIGN KEY (modelo_moto_id) REFERENCES public.motos_modelomoto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_seccionfichatecnica motos_seccionfichatecnica_moto_id_c24967de_fk_motos_moto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_seccionfichatecnica
    ADD CONSTRAINT motos_seccionfichatecnica_moto_id_c24967de_fk_motos_moto_id FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_valoratributomoto motos_valoratributom_tipo_atributo_id_4116b968_fk_motos_tip; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_valoratributomoto
    ADD CONSTRAINT motos_valoratributom_tipo_atributo_id_4116b968_fk_motos_tip FOREIGN KEY (tipo_atributo_id) REFERENCES public.motos_tipoatributo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: motos_valoratributomoto motos_valoratributomoto_moto_id_950f691e_fk_motos_moto_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motos_valoratributomoto
    ADD CONSTRAINT motos_valoratributomoto_moto_id_950f691e_fk_motos_moto_id FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_compatibilidadproductomoto productos_compatibil_moto_id_da92d417_fk_motos_mot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_compatibilidadproductomoto
    ADD CONSTRAINT productos_compatibil_moto_id_da92d417_fk_motos_mot FOREIGN KEY (moto_id) REFERENCES public.motos_moto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_compatibilidadproductomoto productos_compatibil_producto_id_ba87c192_fk_productos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_compatibilidadproductomoto
    ADD CONSTRAINT productos_compatibil_producto_id_ba87c192_fk_productos FOREIGN KEY (producto_id) REFERENCES public.productos_producto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_especificacionproducto productos_especifica_producto_id_2262c53b_fk_productos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_especificacionproducto
    ADD CONSTRAINT productos_especifica_producto_id_2262c53b_fk_productos FOREIGN KEY (producto_id) REFERENCES public.productos_producto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_imagenproducto productos_imagenprod_producto_id_685baa36_fk_productos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_imagenproducto
    ADD CONSTRAINT productos_imagenprod_producto_id_685baa36_fk_productos FOREIGN KEY (producto_id) REFERENCES public.productos_producto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_producto productos_producto_marca_id_fc6a9dea_fk_catalogo_marca_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_producto
    ADD CONSTRAINT productos_producto_marca_id_fc6a9dea_fk_catalogo_marca_id FOREIGN KEY (marca_id) REFERENCES public.catalogo_marca(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: productos_producto productos_producto_subcategoria_id_3e19f3d9_fk_catalogo_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos_producto
    ADD CONSTRAINT productos_producto_subcategoria_id_3e19f3d9_fk_catalogo_ FOREIGN KEY (subcategoria_id) REFERENCES public.catalogo_subcategoriaproducto(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outs_user_id_83bc629a_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outs_user_id_83bc629a_fk_auth_user FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

\unrestrict O2g6PSZm0Ed99uyPU7NS7NcmTGepzpPk4Z5opuIIwDxL5NiQZiwGJlhbPmcxPVX

