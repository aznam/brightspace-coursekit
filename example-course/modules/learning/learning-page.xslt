<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:s="urn:coursekit:semantic" 
                xmlns:l="urn:coursekit:semantic:learning" 
                xmlns:p="urn:coursekit:page" 
                version="1.0">

    <!-- Surcharge du template racine /s:content pour gérer l:section, l:objectives et les titres de navbar -->
    <xsl:template match="/s:content">
        <p:layout>
            <xsl:copy-of select="@title|@subtitle|@image|@background|@style-ref|@variant|@page-numbered"/>
            
            <p:navbar>
                <xsl:copy-of select="@page-title|@module-title"/>
                <xsl:for-each select="s:section[@nav='true'] | l:section[@nav='true'] | l:objectives[@nav='true']">
                    <p:link href="#{@id}">
                        <xsl:value-of select="@title"/>
                    </p:link>
                </xsl:for-each>
            </p:navbar>
            
            <p:hero>
                <xsl:copy-of select="@title|@subtitle|@image"/>
            </p:hero>
            
            <p:sidebar-before>
                <xsl:apply-templates select="s:information[not(preceding-sibling::s:section) and not(preceding-sibling::l:section)]"/>
            </p:sidebar-before>
            
            <p:central-content>
                <xsl:if test="@toc='true'">
                    <p:inline-toc>
                        <xsl:for-each select="s:section | l:section | l:objectives[@id]">
                            <p:link href="#{@id}">
                                <xsl:value-of select="@title"/>
                            </p:link>
                        </xsl:for-each>
                    </p:inline-toc>
                </xsl:if>
                <xsl:apply-templates select="*[not(self::s:information)]"/>
            </p:central-content>
            
            <p:sidebar-after>
                <xsl:apply-templates select="s:information[preceding-sibling::s:section or preceding-sibling::l:section]"/>
            </p:sidebar-after>
        </p:layout>
    </xsl:template>

    <!-- Section métier -> p:section -->
    <xsl:template match="l:section">
        <p:section>
            <xsl:copy-of select="@id|@title|@nav"/>
            <xsl:apply-templates select="node()"/>
        </p:section>
    </xsl:template>

    <!-- Paragraphe enrichi -> p:paragraph -->
    <xsl:template match="l:paragraph">
        <p:paragraph>
            <xsl:copy-of select="@id"/>
            <xsl:apply-templates select="node()"/>
        </p:paragraph>
    </xsl:template>

    <!-- Terme survolable -> p:hoverbox -->
    <xsl:template match="l:term">
        <p:hoverbox title="{@title}">
            <xsl:if test="@id">
                <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
            </xsl:if>
            <xsl:if test="@definition-title">
                <xsl:attribute name="panel-title"><xsl:value-of select="@definition-title"/></xsl:attribute>
            </xsl:if>
            <xsl:apply-templates select="node()"/>
        </p:hoverbox>
    </xsl:template>

    <!-- Infonote -> p:infobox avec variant="info" et style-ref="course-note" -->
    <xsl:template match="l:infonote">
        <p:infobox variant="info" style-ref="course-note">
            <xsl:copy-of select="@id|@title"/>
            <xsl:apply-templates select="node()"/>
        </p:infobox>
    </xsl:template>

    <!-- Bloc dépliable -> p:collapse-box -->
    <xsl:template match="l:details">
        <p:collapse-box>
            <xsl:copy-of select="@id|@title|@open"/>
            <xsl:apply-templates select="node()"/>
        </p:collapse-box>
    </xsl:template>

    <!-- Objectifs -> p:section + p:list -->
    <xsl:template match="l:objectives">
        <p:section>
            <xsl:copy-of select="@id|@title|@nav"/>
            <p:list type="unordered">
                <xsl:for-each select="l:objective">
                    <p:item>
                        <xsl:value-of select="."/>
                    </p:item>
                </xsl:for-each>
            </p:list>
        </p:section>
    </xsl:template>

    <!-- Correction du mapping s:picture -> p:picture : 
         Dans picture.xsd (sémantique), <s:alt> est un élément enfant, 
         mais dans picture.xsd (visuel), alt est un attribut et aucun enfant n'est permis ! -->
    <xsl:template match="s:picture">
        <p:picture src="{@src}">
            <xsl:if test="@id">
                <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
            </xsl:if>
            <xsl:if test="@title">
                <xsl:attribute name="legend"><xsl:value-of select="@title"/></xsl:attribute>
            </xsl:if>
            <xsl:if test="s:alt">
                <xsl:attribute name="alt"><xsl:value-of select="s:alt"/></xsl:attribute>
            </xsl:if>
        </p:picture>
    </xsl:template>

    <!-- Correction du mapping s:link -> p:link :
         Dans link.xsd (sémantique), s:link contient <s:paragraph>, 
         mais dans course-page.xsd, p:link est de type c:LinkType (mixed="true", sans enfant p:paragraph) -->
    <xsl:template match="s:link">
        <p:link href="{@href}">
            <xsl:if test="@id">
                <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="s:paragraph">
                    <xsl:value-of select="s:paragraph"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </p:link>
    </xsl:template>

</xsl:stylesheet>