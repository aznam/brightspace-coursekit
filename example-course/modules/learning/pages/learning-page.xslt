<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="urn:coursekit:semantic"
                xmlns:l="urn:coursekit:semantic:learning"
                xmlns:p="urn:coursekit:page"
                xmlns:xsp="urn:coursekit:preprocessor"
                version="1.0">

    <xsl:template match="l:section">
        <xsp:inherit match="s:section"/>
    </xsl:template>

    <xsl:template match="l:section" mode="navbar">
        <xsp:inherit match="s:section"/>
    </xsl:template>

    <xsl:template match="l:section" mode="toc">
        <xsp:inherit match="s:section"/>
    </xsl:template>

    <xsl:template match="l:paragraph">
        <xsp:inherit match="s:paragraph"/>
    </xsl:template>

    <xsl:template match="l:term">
        <p:hoverbox title="{@title}">
            <xsl:copy-of select="@id"/>
            <xsl:if test="@definition-title">
                <xsl:attribute name="panel-title">
                    <xsl:value-of select="@definition-title"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates select="node()"/>
        </p:hoverbox>
    </xsl:template>

    <xsl:template match="l:infonote">
        <p:infobox variant="info" style-ref="course-note">
            <xsl:copy-of select="@id|@title"/>
            <xsl:apply-templates select="node()"/>
        </p:infobox>
    </xsl:template>

    <xsl:template match="l:details">
        <p:collapse-box>
            <xsl:copy-of select="@id|@title|@open"/>
            <xsl:apply-templates select="node()"/>
        </p:collapse-box>
    </xsl:template>

    <xsl:template match="l:objectives">
        <p:section>
            <xsl:copy-of select="@id|@title|@nav"/>
            <p:list type="unordered">
                <xsl:for-each select="l:objective">
                    <p:item><xsl:value-of select="."/></p:item>
                </xsl:for-each>
            </p:list>
        </p:section>
    </xsl:template>

    <xsl:template match="l:objectives" mode="navbar">
        <xsl:if test="@nav='true'">
            <p:link href="#{@id}"><xsl:value-of select="@title"/></p:link>
        </xsl:if>
    </xsl:template>

    <xsl:template match="l:objectives" mode="toc">
        <xsl:if test="@id">
            <p:link href="#{@id}"><xsl:value-of select="@title"/></p:link>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
