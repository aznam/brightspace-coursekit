<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="urn:coursekit:semantic"
    xmlns:p="urn:coursekit:page"
    xmlns:xsp="urn:coursekit:preprocessor"
    xmlns:mp="urn:coursekit:page:people"
    xmlns:ms="urn:coursekit:semantic:people"
    xmlns:mc="urn:coursekit:visual:people"
    version="1.0">
  <xsl:import href="$(frameworkRoot)/pages/course-page/transform.xslt"/>
  <xsl:template match="ms:people-section">
    <xsp:inherit match="s:section"/>
  </xsl:template>
  <xsl:template match="ms:people-section" mode="navbar">
    <xsp:inherit match="s:section"/>
  </xsl:template>
  <xsl:template match="ms:people-section" mode="toc">
    <xsp:inherit match="s:section"/>
  </xsl:template>
  <xsl:template match="ms:team">
    <mp:assistant-grid>
      <xsl:copy-of select="@id"/>
      <xsl:apply-templates select="ms:person" mode="compact"/>
    </mp:assistant-grid>
  </xsl:template>
  <xsl:template match="ms:person">
    <xsl:call-template name="people-card">
      <xsl:with-param name="variant" select="'split'"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="ms:person" mode="compact">
    <xsl:call-template name="people-card">
      <xsl:with-param name="variant" select="'compact'"/>
    </xsl:call-template>
  </xsl:template>
  <xsl:template name="people-card">
    <xsl:param name="variant"/>
    <mp:assistant-card variant="{$variant}">
      <xsl:copy-of select="@id|@name|@role|@title|@photo|@email|@booking-url|@online-hours"/>
      <xsl:for-each select="ms:office-hours">
        <mp:office-hours>
          <xsl:copy-of select="@*"/>
          <xsl:value-of select="."/>
        </mp:office-hours>
      </xsl:for-each>
      <xsl:for-each select="ms:description">
        <mp:person-description>
          <xsl:copy-of select="@*"/>
          <xsl:apply-templates select="node()"/>
        </mp:person-description>
      </xsl:for-each>
    </mp:assistant-card>
  </xsl:template>
</xsl:stylesheet>
