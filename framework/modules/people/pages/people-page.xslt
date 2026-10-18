<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:s="urn:coursekit:semantic" xmlns:p="urn:coursekit:page"
 xmlns:xsp="urn:coursekit:preprocessor">
 <xsl:import href="$(frameworkRoot)/pages/course-page/transform.xslt"/>

 <xsl:template match="s:people-section">
   <xsp:inherit match="s:section"/>
 </xsl:template>
 <xsl:template match="s:people-section" mode="navbar">
   <xsp:inherit match="s:section"/>
 </xsl:template>
 <xsl:template match="s:people-section" mode="toc">
   <xsp:inherit match="s:section"/>
 </xsl:template>

 <xsl:template match="s:team">
   <p:assistant-grid>
     <xsl:copy-of select="@id"/>
     <xsl:apply-templates select="s:person" mode="compact"/>
   </p:assistant-grid>
 </xsl:template>
 <xsl:template match="s:person">
   <xsl:call-template name="people-card">
     <xsl:with-param name="variant" select="'split'"/>
   </xsl:call-template>
 </xsl:template>
 <xsl:template match="s:person" mode="compact">
   <xsl:call-template name="people-card">
     <xsl:with-param name="variant" select="'compact'"/>
   </xsl:call-template>
 </xsl:template>
 <xsl:template name="people-card">
   <xsl:param name="variant"/>
   <p:assistant-card variant="{$variant}">
     <xsl:copy-of select="@id|@name|@role|@title|@photo|@email|@booking-url|@online-hours"/>
     <xsl:for-each select="s:office-hours">
       <p:office-hours><xsl:copy-of select="@*"/><xsl:value-of select="."/></p:office-hours>
     </xsl:for-each>
     <xsl:for-each select="s:description">
       <p:person-description>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates select="node()"/>
       </p:person-description>
     </xsl:for-each>
   </p:assistant-card>
 </xsl:template>
</xsl:stylesheet>
