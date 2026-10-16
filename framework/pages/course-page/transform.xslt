<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:s="urn:coursekit:semantic" 
                xmlns:p="urn:coursekit:page" 
                version="1.0">
    
    <xsl:output method="xml"/>

    <!-- L'enveloppe principale (Layout et Zones) -->
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

                    <xsl:for-each select="s:section[@nav='true']">
                        <p:link href="#{@id}">
                            <xsl:value-of select="@title"/>
                        </p:link>
                    </xsl:for-each>

                </p:navbar>
                
                <p:hero>
                    <xsl:copy-of select="@title|@subtitle|@image"/>
                </p:hero>
                
                <p:sidebar-before>
                    <xsl:apply-templates select="s:information[not(preceding-sibling::s:section)]"/>
                </p:sidebar-before>
                
                <p:central-content>
                    <xsl:if test="@toc='true'">
                        <p:inline-toc>
                            <xsl:for-each select="s:section">
                                <p:link href="#{@id}">
                                    <xsl:value-of select="@title"/>
                                </p:link>
                            </xsl:for-each>
                        </p:inline-toc>
                    </xsl:if>
                    <xsl:apply-templates select="*[not(self::s:information)]"/>
                </p:central-content>
                
                <p:sidebar-after>
                    <xsl:apply-templates select="s:information[preceding-sibling::s:section]"/>
                </p:sidebar-after>
            </p:layout>
        </p:course-page>
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
        <xsl:message terminate="yes">Unknown semantic element</xsl:message>
    </xsl:template>

</xsl:stylesheet>