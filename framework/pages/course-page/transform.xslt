<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:s="urn:coursekit:semantic" 
                xmlns:p="urn:coursekit:page" 
                xmlns:xsp="urn:coursekit:preprocessor"
                xmlns:ckerr="urn:coursekit:diagnostics" 
                version="1.0">
    
    <xsl:output method="xml"/>

    <xsl:template match="/s:content">
        <p:course-page>
            <p:meta>
                <p:var name="course-code" ref="course.code"/>
                <p:var name="course-title" ref="course.title"/>
                <p:var name="module-name" value="{@module-name}"/>
            </p:meta>
            <p:layout>
                <xsl:copy-of select="@title|@subtitle|@image|@background|@style-ref|@variant|@page-numbered"/>
                
                <p:navbar
                    course-code="${course-code}"
                    page-title="${course-title}"
                    module-title="${module-name}">
                    <xsl:if test="@theme-switch='true'">
                        <p:theme-switch/>
                    </xsl:if>
                    <xsp:slot name="navbar-items">
                        <xsl:apply-templates select="*" mode="navbar"/>
                    </xsp:slot>

                </p:navbar>
                
                <p:hero>
                    <xsl:copy-of select="@title|@subtitle|@image"/>
                </p:hero>
                
                <p:sidebar-before>
                    <xsl:apply-templates select="s:information[not(preceding-sibling::*[local-name()='section'])]"/>
                </p:sidebar-before>
                
                <p:central-content>
                    <xsl:if test="@toc='true'">
                        <p:inline-toc>
                            <xsp:slot name="toc-items">
                            <xsl:apply-templates select="*" mode="toc"/>
                        </xsp:slot>
                        </p:inline-toc>
                    </xsl:if>
                    <xsl:apply-templates select="*[not(self::s:information)]"/>
                </p:central-content>
                
                <p:sidebar-after>
                    <xsl:apply-templates select="s:information[preceding-sibling::*[local-name()='section']]"/>
                </p:sidebar-after>
            </p:layout>
        </p:course-page>
    </xsl:template>

    <!-- Contributions à la navigation, dans l'ordre du XML source -->
    <xsl:template match="*" mode="navbar" priority="-1"/>

    <xsl:template match="s:section" mode="navbar">
        <xsl:if test="@nav='true'">
            <p:link href="#{@id}"><xsl:value-of select="@title"/></p:link>
        </xsl:if>
    </xsl:template>

    <!-- Contributions à la table des matières -->
    <xsl:template match="*" mode="toc" priority="-1"/>

    <xsl:template match="s:section" mode="toc">
        <p:link href="#{@id}"><xsl:value-of select="@title"/></p:link>
    </xsl:template>

    <xsl:template match="s:section">
        <p:section><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:section>
    </xsl:template>

    <xsl:template match="s:information">
        <p:side><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:side>
    </xsl:template>

    <xsl:template match="s:note">
        <p:infobox><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:infobox>
    </xsl:template>

    <!-- Mapping des Noeuds -->
    <xsl:template match="s:paragraph">
        <p:paragraph><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:paragraph>
    </xsl:template>

    <xsl:template match="s:heading">
        <p:heading><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:heading>
    </xsl:template>

    <xsl:template match="s:list">
        <p:list><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:list>
    </xsl:template>

    <xsl:template match="s:item">
        <p:item><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:item>
    </xsl:template>

    <xsl:template match="s:link">
        <p:link><xsl:copy-of select="@*"/><xsl:apply-templates select="node()"/></p:link>
    </xsl:template>

    <!-- Inline semantic typography is mapped once, without custom JavaScript. -->
    <xsl:template match="s:important|s:emphase|s:underline">
        <p:text-style kind="{local-name()}">
            <xsl:copy-of select="@id"/>
            <xsl:apply-templates select="node()"/>
        </p:text-style>
    </xsl:template>

    <xsl:template match="s:picture">
        <p:picture>
            <xsl:copy-of select="@*[local-name() != 'title']"/>

            <xsl:attribute name="alt">
                <xsl:value-of select="@title"/>
            </xsl:attribute>

            <xsl:if test="normalize-space(.) != ''">
                <xsl:attribute name="legend">
                    <xsl:value-of select="normalize-space(.)"/>
                </xsl:attribute>
            </xsl:if>
        </p:picture>
    </xsl:template>

    <xsl:template match="text()">
        <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="*">
        <ckerr:unknown
            element="{name()}"
            namespace="{namespace-uri()}"/>
    </xsl:template>

</xsl:stylesheet>
